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
    const copy = HOME_AUDIENCES.flatMap((a) => [a.label, ...a.tabs.flatMap((t) => [t.label, t.headline, t.description])]);
    for (const text of copy) expect(text, text).not.toContain('—');
  });

  it('gives only the general contractor Identify tab the role link and checklist (Section 54.2.1)', () => {
    const extras = HOME_AUDIENCES.flatMap((a) => a.tabs).filter((t) => t.roleLink || t.checklist);
    expect(extras.map((t) => t.id)).toEqual(['gc-identify']);
    const [identify] = extras;
    expect(identify.roleLink).toEqual({
      label: 'Explore JiTpro for general contractors',
      to: '/roles/general-contractors',
    });
    expect(identify.checklist).toEqual([
      'Review project scope',
      'Identify products, materials, and services',
      'Build the Procurement Register',
    ]);
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
