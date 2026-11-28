import { describe, expect, it } from 'vitest';
import { CLOSING } from './advantageContent';

/** The page's closing section (founder brief Build the Final JiTpro Advantage CTA Section, 2026-11-27; Section 83.1 item 7). */
describe('the closing section copy', () => {
  it('is the approved copy, in sentence case (Section 7.7)', () => {
    expect(CLOSING.eyebrow).toBe('Your next project starts here');
    expect([...CLOSING.heading.lines, CLOSING.heading.question]).toEqual([
      'Your competitors are',
      'sharpening their pencils.',
      'What are you sharpening?',
    ]);
    expect(CLOSING.intro.join(' ')).toBe(
      "You don't have to rebuild your company overnight. Start with one project. Let JiTpro help your team take early control of the information, decisions, commitments, and procurement activities that support field execution.",
    );
    expect(CLOSING.statement).toBe('Build a stronger company. Compete with confidence.');
    expect(CLOSING.action).toBe("Let's talk about your next project");
    expect(CLOSING.signature).toBe('One project at a time.');
  });

  it('has no em dashes (Section 83)', () => {
    expect(JSON.stringify(CLOSING)).not.toMatch(/—/);
  });
});
