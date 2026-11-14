import { describe, expect, it } from 'vitest';
import {
  INITIAL_SELECTION,
  audienceFor,
  railFocusTarget,
  selectAudience,
  selectTab,
} from './audienceSelection';

describe('audience selection (Design System Section 46.12, State)', () => {
  it('opens on general contractors, first tab', () => {
    expect(INITIAL_SELECTION).toEqual({ audienceId: 'general-contractors', tabIndex: 0 });
    expect(audienceFor(INITIAL_SELECTION).id).toBe('general-contractors');
  });

  it('opens the first tab whenever the audience changes, without remembering the old tab', () => {
    const onControl = selectTab(INITIAL_SELECTION, 3);
    expect(onControl.tabIndex).toBe(3);

    const architects = selectAudience(onControl, 'architects');
    expect(architects).toEqual({ audienceId: 'architects', tabIndex: 0 });

    const back = selectAudience(selectTab(architects, 2), 'general-contractors');
    expect(back).toEqual({ audienceId: 'general-contractors', tabIndex: 0 });
  });

  it('re-choosing the current audience still returns to its first tab', () => {
    expect(selectAudience(selectTab(INITIAL_SELECTION, 2), 'general-contractors').tabIndex).toBe(0);
  });

  it('ignores an unknown audience', () => {
    const s = selectTab(INITIAL_SELECTION, 1);
    expect(selectAudience(s, 'nobody')).toBe(s);
  });

  it('bounds tab selection to the current audience', () => {
    const architects = selectAudience(INITIAL_SELECTION, 'architects');
    expect(selectTab(architects, 2).tabIndex).toBe(2);
    expect(selectTab(architects, 3)).toBe(architects); // architects have three tabs
    expect(selectTab(architects, -1)).toBe(architects);
    expect(selectTab(architects, 1.5)).toBe(architects);
  });

  it('falls back to the first audience for an unknown id', () => {
    expect(audienceFor({ audienceId: 'nobody', tabIndex: 0 }).id).toBe('general-contractors');
  });
});

describe('railFocusTarget (manual-activation tabs)', () => {
  it('moves right and left with wrap-around', () => {
    expect(railFocusTarget('ArrowRight', 0, 4)).toBe(1);
    expect(railFocusTarget('ArrowRight', 3, 4)).toBe(0);
    expect(railFocusTarget('ArrowLeft', 0, 3)).toBe(2);
    expect(railFocusTarget('ArrowLeft', 2, 3)).toBe(1);
  });

  it('jumps to the ends with Home and End', () => {
    expect(railFocusTarget('Home', 2, 4)).toBe(0);
    expect(railFocusTarget('End', 0, 4)).toBe(3);
  });

  it('leaves every other key to the browser, including Enter and Space, which commit via click', () => {
    for (const key of ['Enter', ' ', 'Tab', 'ArrowUp', 'ArrowDown', 'a']) {
      expect(railFocusTarget(key, 1, 4)).toBeNull();
    }
  });

  it('handles an empty rail', () => {
    expect(railFocusTarget('ArrowRight', 0, 0)).toBeNull();
  });
});
