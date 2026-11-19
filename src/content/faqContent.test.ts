import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collapseAll, expandAll, toggle } from '../components/faq/accordionState';
import { FAQS, answerText } from './faqContent';

/** The founder-approved correction of 2026-11-17, in answers 03 and 09. */
const OLD_SENTENCE = 'The cost of preventing a problem is always substantially less than the cost of recovering from it.';
const NEW_SENTENCE =
  'In construction, upfront investment in planning and quality control is consistently far less expensive than the cost of rework and delays.';

describe('FAQ content', () => {
  it('has the ten approved questions, numbered 01 to 10, in order', () => {
    expect(FAQS.map((f) => f.number)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    expect(FAQS.map((f) => f.question)).toEqual([
      'What exactly does JiTpro do?',
      "How is JiTpro different from what we're already doing?",
      'How does JiTpro help protect our schedule and profits?',
      'When is the best time to bring JiTpro into a project?',
      'What does working with JiTpro actually look like?',
      'Will JiTpro replace our project management team?',
      'What kinds of construction projects benefit most from JiTpro?',
      "What happens if we don't have a dedicated procurement planning process?",
      'How much does JiTpro cost, and is it worth the investment?',
      'How do we get started with JiTpro?',
    ]);
  });

  it('keeps the key sentences exactly', () => {
    const all = FAQS.map(answerText).join('\n');
    expect(all).toContain(NEW_SENTENCE);
    expect(all.split(NEW_SENTENCE)).toHaveLength(3);
    expect(all).not.toContain(OLD_SENTENCE);
    expect(all).toContain("You're already paying for procurement management.");
    expect(answerText(FAQS[0])).toContain('Our goal is simple: Get the field what it needs, when it needs it.');
  });

  it('matches the approved reference word for word, with the one approved correction', () => {
    const html = readFileSync(resolve(__dirname, '../../docs/design/assets/faq-preview/JiTpro_FAQ_Interactive_Mockup.html'), 'utf8');
    const decode = (s: string) => s.replace(/&amp;/g, '&');
    const items = [...html.matchAll(/<details class="faq-item"[^>]*>([\s\S]*?)<\/details>/g)].map((m) => m[1]);
    expect(items).toHaveLength(10);
    items.forEach((item, i) => {
      const question = decode(/<span class="question">([\s\S]*?)<\/span>/.exec(item)![1]);
      const answer = /<div class="answer">([\s\S]*)<\/div>$/.exec(item)![1];
      const blocks = [...answer.matchAll(/<(p|div)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => decode(m[2].replace(/<[^>]+>/g, '')).replace(OLD_SENTENCE, NEW_SENTENCE));
      expect(FAQS[i].question).toBe(question);
      expect(answerText(FAQS[i])).toBe(blocks.join('\n'));
    });
  });

  it('never offers rescue of a troubled project, and adds no em dashes', () => {
    for (const f of FAQS) {
      expect(f.question.toLowerCase()).not.toMatch(/rescue|troubled|turnaround/);
      expect(`${f.question}\n${answerText(f)}`).not.toContain('\u2014');
    }
  });
});

describe('FAQ accordion', () => {
  const ids = FAQS.map((f) => f.number);

  it('opens one question at a time', () => {
    let open = toggle(new Set(['01']), '04');
    expect([...open]).toEqual(['04']);
    open = toggle(open, '04');
    expect([...open]).toEqual([]);
  });

  it('expands and collapses all, and closes singly after expanding all', () => {
    let open = expandAll(ids);
    expect(open.size).toBe(10);
    open = toggle(open, '03');
    expect(open.size).toBe(9);
    expect(open.has('03')).toBe(false);
    expect(collapseAll().size).toBe(0);
  });
});

describe('routes', () => {
  it('serves the new FAQ at /faq and the original at /faq-legacy, with no preview route and nothing new in navigation', () => {
    const app = readFileSync(resolve(__dirname, '../App.tsx'), 'utf8');
    expect(app).toContain('<Route path="/faq" element={<FAQ />} />');
    expect(app).toMatch(/path="\/faq-legacy"\s+element=\{[\s\S]*?<RobotsNoindex \/>[\s\S]*?<FAQLegacy \/>/);
    expect(app).not.toContain('faq-preview');
    expect(app).toContain("import FAQ from './pages/FAQ';");
    expect(app).toContain("import FAQLegacy from './pages/FAQLegacy';");
    const nav = readFileSync(resolve(__dirname, '../components/Navigation.tsx'), 'utf8');
    const footer = readFileSync(resolve(__dirname, '../components/Footer.tsx'), 'utf8');
    // The header has three direct links since 2026-11-18 (About JiTpro, Founder Story, Contact Us), so it no
    // longer links the FAQ; neither the header nor the footer may link the legacy FAQ.
    expect(nav).not.toContain('faq-legacy');
    expect(footer).not.toContain('faq-legacy');
  });
});
