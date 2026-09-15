import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LEAD_MAGNET_ASSETS, LEAD_MAGNET_IDS } from './leadMagnets';

/**
 * Sprint 1b consistency checks (lead-gen plan, Decisions D5.1, D5.2, D5.10).
 *
 * The registry, the committed PDF, `public/_redirects`, and `public/_headers`
 * must agree, and drift must fail CI rather than surface as a broken guide
 * link after a release. These read the repository files directly, so they also
 * catch a file that was renamed or removed by hand.
 */

const REDIRECTS = readFileSync('public/_redirects', 'utf8');
const HEADERS = readFileSync('public/_headers', 'utf8');

function redirectLines(): string[][] {
  return REDIRECTS.split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => line.split(/\s+/));
}

describe.each(LEAD_MAGNET_IDS)('asset consistency: %s', (id) => {
  const asset = LEAD_MAGNET_ASSETS[id];
  const filePath = `public/guides/${asset.fileName}`;

  it('has its versioned PDF committed under public/guides/', () => {
    expect(existsSync(filePath), `${filePath} is missing`).toBe(true);
    expect(statSync(filePath).size).toBeGreaterThan(10_000);
    expect(readFileSync(filePath).subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });

  it('routes the stable path to exactly that file with a 302', () => {
    const rule = redirectLines().find((parts) => parts[0] === asset.publicPath);
    expect(rule, `no _redirects rule for ${asset.publicPath}`).toBeDefined();
    expect(rule?.[1]).toBe(`/guides/${asset.fileName}`);
    expect(rule?.[2]).toBe('302');
  });

  it('places the stable route above the SPA catch-all', () => {
    const order = redirectLines().map((parts) => parts[0]);
    const guideIndex = order.indexOf(asset.publicPath);
    const catchAllIndex = order.indexOf('/*');
    expect(guideIndex).toBeGreaterThanOrEqual(0);
    expect(catchAllIndex).toBeGreaterThanOrEqual(0);
    expect(guideIndex).toBeLessThan(catchAllIndex);
  });

  it('serves the PDF inline, under the clean filename, unindexed, and cached hard', () => {
    const block = HEADERS.split(/\n(?=\S)/).find((section) =>
      section.startsWith(`/guides/${asset.fileName}`),
    );
    expect(block, `no _headers block for /guides/${asset.fileName}`).toBeDefined();
    expect(block).toContain(`Content-Disposition: inline; filename="${asset.downloadFileName}"`);
    expect(block).toContain('X-Robots-Tag: noindex');
    expect(block).toMatch(/Cache-Control: public, max-age=31536000, immutable/);
  });

  it('keeps the SPA catch-all intact for every other route', () => {
    const catchAll = redirectLines().find((parts) => parts[0] === '/*');
    expect(catchAll?.[1]).toBe('/index.html');
    expect(catchAll?.[2]).toBe('200');
  });
});
