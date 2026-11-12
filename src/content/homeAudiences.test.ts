import { describe, expect, it } from 'vitest';
import { CONNECT_DEPENDENCY_CATEGORIES, DEFAULT_AUDIENCE_ID, HOME_AUDIENCES } from './homeAudiences';

describe('HOME_AUDIENCES (Design System Section 54.2)', () => {
  it('has the three approved audiences in order, with general contractors first and default', () => {
    expect(HOME_AUDIENCES.map((a) => a.id)).toEqual(['general-contractors', 'architects', 'owners']);
    expect(DEFAULT_AUDIENCE_ID).toBe(HOME_AUDIENCES[0].id);
  });

  it('gives each audience its own tab count (4 / 3 / 4), not a forced equal count', () => {
    expect(HOME_AUDIENCES.map((a) => a.tabs.length)).toEqual([4, 3, 4]);
  });

  it('keeps the approved tab order', () => {
    expect(HOME_AUDIENCES.map((a) => a.tabs.map((t) => t.label))).toEqual([
      ['Identify', 'Plan', 'Connect', 'Control'],
      ['See what’s coming', 'Plan your workload', 'Focus on priorities'],
      ['Reduce risk', 'Protect your investment', 'More predictability', 'Better decisions'],
    ]);
  });

  it('uses ids that are unique across every audience, since they become DOM ids', () => {
    const ids = [...HOME_AUDIENCES.map((a) => a.id), ...HOME_AUDIENCES.flatMap((a) => a.tabs.map((t) => t.id))];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('sets option and tab labels in sentence case (Sections 7.7, 48.1)', () => {
    const labels = [...HOME_AUDIENCES.map((a) => a.label), ...HOME_AUDIENCES.flatMap((a) => a.tabs.map((t) => t.label))];
    for (const label of labels) {
      const [first, ...rest] = label.split(' ');
      expect(first[0], label).toBe(first[0].toUpperCase());
      for (const word of rest) expect(word, label).toBe(word.toLowerCase());
    }
  });

  it('carries no em dashes in rendered copy (Section 7.7)', () => {
    const copy = HOME_AUDIENCES.flatMap((a) => [
      a.label,
      ...a.tabs.flatMap((t) => [t.label, t.headline, t.description, t.descriptionMore ?? '', t.closing ?? '']),
    ]);
    for (const text of copy) expect(text, text).not.toContain('—');
  });

  it('carries the founder-supplied Identify copy (2026-11-11, Section 54.2.1)', () => {
    const identify = HOME_AUDIENCES.flatMap((a) => a.tabs).find((t) => t.id === 'gc-identify')!;
    expect(identify.label).toBe('Identify');
    expect(identify.headline).toBe('You can’t manage what you haven’t identified.');
    expect(identify.description).toBe(
      'Every construction project contains hundreds of products, materials, and services scattered across drawings, specifications, and schedules.',
    );
    expect(identify.descriptionMore).toBe(
      'JiTpro brings these requirements together into a comprehensive procurement inventory, identifies missing or undefined scope, and helps establish what the project actually needs.',
    );
    expect(identify.closing).toBe('Know what you need. Know what’s missing.');
  });

  it('carries the founder-supplied Plan copy (2026-11-11)', () => {
    const plan = HOME_AUDIENCES.flatMap((a) => a.tabs).find((t) => t.id === 'gc-plan')!;
    expect(plan.label).toBe('Plan');
    expect(plan.headline).toBe('Know what needs to happen. Know when it needs to happen.');
    expect(plan.description).toBe(
      'Every product, material, and service follows its own procurement path, with activities that must happen in the right sequence and require real time to complete.',
    );
    expect(plan.descriptionMore).toBe(
      'JiTpro starts with when the field needs each item, then works backward to establish the activities, durations, and dates required to deliver it on time.',
    );
    expect(plan.closing).toBe('The right work. In the right order. At the right time.');
  });

  it('gives only Identify, Plan and Control a second paragraph and closing statement, Reduce risk a second paragraph alone, and no tab the withdrawn role link or checklist', () => {
    const tabs = HOME_AUDIENCES.flatMap((a) => a.tabs);
    expect(tabs.filter((t) => t.closing).map((t) => t.id)).toEqual(['gc-identify', 'gc-plan', 'gc-control']);
    expect(tabs.filter((t) => t.descriptionMore).map((t) => t.id)).toEqual(['gc-identify', 'gc-plan', 'gc-control', 'owner-reduce-risk', 'owner-protect-investment']);
    expect(tabs.filter((t) => t.roleLink || t.checklist)).toEqual([]);
  });

  it('carries the Project owners copy as supplied, naming the contractor as the one who uses JiTpro (Section 54.2.4)', () => {
    const owners = HOME_AUDIENCES.find((a) => a.id === 'owners')!;
    expect(owners.tabs.map((t) => [t.label, t.headline])).toEqual([
      ['Reduce risk', 'Your construction project shouldn’t have to feel like a gamble.'],
      ['Protect your investment', 'Protect your investment with a contractor who plans beyond their own budget.'],
      ['More predictability', 'Know what’s coming before it becomes urgent.'],
      ['Better decisions', 'Know what needs your decision, and why it matters.'],
    ]);
    // The takeaway is the visual's closing line, not copy. Reduce risk alone has a second paragraph (revised 2026-11-11; rewritten 2026-11-12).
    for (const t of owners.tabs) expect(t.closing ?? t.checklist ?? t.roleLink).toBeUndefined();
    for (const t of owners.tabs.slice(2)) expect(t.descriptionMore).toBeUndefined();
    const risk = owners.tabs[0];
    expect(risk.description).toBe(
      'You’re trusting your general contractor with a substantial investment. You deserve confidence that they’re planning ahead, managing risks, and keeping you informed before problems threaten your budget or schedule.',
    );
    expect(risk.descriptionMore).toBe(
      'You deserve a contractor with a plan, not just a promise. JiTpro helps them build and manage the procurement plan that supports that promise.',
    );
    // Where JiTpro acts, it acts through the owner's contractor.
    expect(risk.descriptionMore).toContain('a contractor with a plan');
    expect(risk.descriptionMore).toContain('JiTpro helps them build and manage the procurement plan');
    for (const t of owners.tabs.slice(1)) expect(`${t.description} ${t.descriptionMore ?? ''}`).toMatch(/JiTpro helps your (general )?contractor/);
    // Protect your investment (rewritten 2026-11-12, twice): the owner's investment reaches beyond construction, and the contractor is the owner's partner in protecting it.
    const protect = owners.tabs[1];
    expect(protect.description).toBe(
      'Your investment extends beyond what you pay your contractor. You’re also paying architects, engineers, designers, and consultants whose time and resources depend on how well the entire project is coordinated.',
    );
    expect(protect.descriptionMore).toBe(
      'JiTpro helps your general contractor plan beyond their own work, coordinating information, decisions, and responsibilities across the project team to reduce unnecessary costs and protect your investment.',
    );
    expect(protect.descriptionMore).toMatch(/^JiTpro helps your general contractor plan beyond their own work/);
    expect(`${protect.headline} ${protect.description} ${protect.descriptionMore}`).not.toMatch(/chaos/i);
    expect(`${protect.description} ${protect.descriptionMore}`).not.toMatch(/change order|eliminate|always|never/i);
    expect(owners.tabs.map((t) => `${t.description} ${t.descriptionMore ?? ''}`).join(' ')).not.toMatch(/guarantee|ROI|\d/i);
  });

  it('carries the Control copy exactly as supplied, its first two paragraphs set as one (Section 54.2.3)', () => {
    const control = HOME_AUDIENCES[0].tabs.find((t) => t.id === 'gc-control')!;
    expect(control.label).toBe('Control');
    expect(control.headline).toBe('Replace constant urgency with deliberate timing.');
    expect(control.description).toBe(
      'JiTpro helps you establish clear priorities for your entire project team. Owners, architects, consultants, and vendors know what’s expected of them, when it’s needed, and what’s coming next.',
    );
    expect(control.descriptionMore).toBe('Instead of demanding everything at once, you can focus everyone on the right work at the right time.');
    expect(control.closing).toBe('Less chasing. Clearer priorities. Better coordination.');
  });

  it('gives only the general contractor Connect tab the six-category dependency summary (Section 54.2.2)', () => {
    const withSummary = HOME_AUDIENCES.flatMap((a) => a.tabs).filter((t) => t.dependencyCategories);
    expect(withSummary.map((t) => t.id)).toEqual(['gc-connect']);
    expect(withSummary[0].dependencyCategories).toBe(CONNECT_DEPENDENCY_CATEGORIES);
    expect(CONNECT_DEPENDENCY_CATEGORIES.map((c) => c.label)).toEqual([
      'Design & Engineering',
      'Owner Decisions & Selections',
      'External Inputs & Commitments',
      'Scope & Trade Commitments',
      'Permits & Agency Requirements',
      'Field & Installation Requirements',
    ]);
    expect(new Set(CONNECT_DEPENDENCY_CATEGORIES.map((c) => c.id)).size).toBe(6);
  });

  it('keeps the scheduled activities of Plan out of the Connect summary: no reviews or approvals category', () => {
    for (const { label } of CONNECT_DEPENDENCY_CATEGORIES) expect(label, label).not.toMatch(/review|approval|revision|submittal/i);
  });

  it('carries the founder-supplied Connect copy (2026-11-11)', () => {
    const connect = HOME_AUDIENCES.flatMap((a) => a.tabs).find((t) => t.id === 'gc-connect')!;
    expect(connect.headline).toBe('Make sure every procurement activity has what it needs to move forward, without interruption.');
    expect(connect.description).toBe(
      'Identify the decisions, information, approvals, and other requirements that each activity depends on. Connect them to the procurement schedule, establish responsibility, and make clear when each is needed.',
    );
  });

  it('has a headline and description for every tab', () => {
    for (const tab of HOME_AUDIENCES.flatMap((a) => a.tabs)) {
      expect(tab.headline.trim().length, tab.id).toBeGreaterThan(0);
      expect(tab.description.trim().length, tab.id).toBeGreaterThan(0);
    }
  });
});
