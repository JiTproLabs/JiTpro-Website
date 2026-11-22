import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BUSINESS_MODEL,
  COMPARISON,
  ENGAGEMENT,
  FINAL_CTA,
  FINANCIAL_SENSE,
  HERO,
  PRICING,
  SUPPORT,
  formatFee,
} from './pricingContent';

/** The unlaunched /pricing page (Design System §82, issue #94). */

const SRC = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(__dirname, path), 'utf8');

/** Every string in the page's copy. */
function allCopy(): string[] {
  const out: string[] = [];
  const walk = (value: unknown) => {
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  [HERO, PRICING, ENGAGEMENT, SUPPORT, COMPARISON, FINANCIAL_SENSE, BUSINESS_MODEL, FINAL_CTA].forEach(walk);
  return out;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|jsx?)$/.test(name) ? [path] : [];
  });
}

describe('pricing page copy', () => {
  it('shows the four approved example fees for the $3.5 million example, lowest first', () => {
    expect(ENGAGEMENT.exampleCaption).toBe('Example: $3.5 million construction project');
    expect(ENGAGEMENT.rows.map((r) => [r.stage, formatFee(r.fee)])).toEqual([
      ['Advanced development', '$14,300'],
      ['Typical development', '$15,800'],
      ['Ongoing development', '$18,200'],
      ['Early development', '$20,600'],
    ]);
    expect(ENGAGEMENT.disclaimer).toEqual([
      'These are estimates, not fixed pricing packages.',
      'Final fees are based on the actual scope and professional effort required.',
    ]);
  });

  it('publishes no monthly support price', () => {
    for (const text of [...Object.values(SUPPORT).flat(), ...COMPARISON.services[1].points]) {
      expect(text).not.toMatch(/\$\s?\d/);
    }
  });

  it('lists the seven deliverables in order, names only', () => {
    expect(ENGAGEMENT.deliverables).toEqual([
      'Scope Validation & Coverage',
      'Project Readiness Gap Assignment',
      'Commitment Register',
      'Product Register',
      'Submittal Register',
      'Procurement Register',
      'Procurement Schedule',
    ]);
  });

  it('keeps the approved economic statement exactly', () => {
    expect(FINANCIAL_SENSE.statement).toBe('The cost of prevention is a fraction of the cost of recovery.');
  });

  it('uses no em dashes', () => {
    for (const text of allCopy()) expect(text).not.toContain('—');
    expect(read('../pages/Pricing.tsx')).not.toContain('—');
  });

  it('makes no promises it must not make', () => {
    const banned = [/no contracts?\b/i, /guarantee/i, /\bSaaS\b/i, /platform/i, /poorly/i, /badly/i, /deficien/i, /\beliminat/i, /unlimited/i];
    for (const text of allCopy()) for (const pattern of banned) expect(text).not.toMatch(pattern);
  });

  it('mentions subscriptions and licenses only to say JiTpro has none', () => {
    for (const text of allCopy().filter((t) => /subscription|licen[cs]e/i.test(t))) expect(text).toMatch(/^No /);
  });
});

describe('pricing page launch restrictions', () => {
  it('marks the route noindex, nofollow', () => {
    expect(read('../App.tsx')).toMatch(/path="\/pricing"\s+element=\{[\s\S]*?<RobotsNoindex \/>[\s\S]*?<Pricing \/>/);
    expect(readFileSync(resolve(SRC, '../public/_headers'), 'utf8')).toMatch(/\/pricing\n\s+X-Robots-Tag: noindex, nofollow/);
  });

  it('is not linked from the header, the footer or any other page', () => {
    const allowed = new Set(['App.tsx', 'pages/Pricing.tsx', 'content/pricingContent.ts', 'content/pricingContent.test.ts']);
    const linking = sourceFiles(SRC)
      .map((path) => relative(SRC, path))
      .filter((path) => !allowed.has(path))
      .filter((path) => /['"`]\/pricing\b/.test(readFileSync(join(SRC, path), 'utf8')));
    expect(linking).toEqual([]);
  });
});
