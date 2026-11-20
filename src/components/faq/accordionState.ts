/**
 * The FAQ page accordion's rules (Design System §65), as pure functions so
 * they can be tested without a browser.
 *
 * - Opening a question closes every other open question.
 * - Closing a question closes only that question (so after Expand all,
 *   questions close one at a time).
 * - Expand all opens every question; Collapse all closes every question.
 */

export type OpenSet = ReadonlySet<string>;

export function toggle(open: OpenSet, id: string): OpenSet {
  if (open.has(id)) {
    const next = new Set(open);
    next.delete(id);
    return next;
  }
  return new Set([id]);
}

export const expandAll = (ids: readonly string[]): OpenSet => new Set(ids);

export const collapseAll = (): OpenSet => new Set();
