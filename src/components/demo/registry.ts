import type { ComponentType } from 'react';
import CommitmentRegisterScreen from './screens/CommitmentRegisterScreen';
import ProcurementScheduleScreen from './screens/procurement-schedule/ProcurementScheduleScreen';
import ProductRegisterScreen from './screens/ProductRegisterScreen';
import ScopeGapAnalysisScreen from './screens/ScopeGapAnalysisScreen';
import ScopeValidationScreen from './screens/ScopeValidationScreen';

/**
 * The canonical screen registry, keyed by the methodology stage `id` in
 * `src/content/methodologyStages.ts`.
 *
 * THE REGISTRY DECIDES WHAT A STAGE'S SCREEN IS. Every captured stage has an
 * entry, and the entry says whether the stage has a live React screen or
 * still its raster capture, whether the expanded view is interactive, and how
 * it may be sized. The pages never ask; they render DemoScreenFrame for the
 * stage and the frame reads the entry. A stage with no entry is treated as
 * not captured and keeps the reserved placeholder (Design System 46.8.1).
 *
 * MIGRATING A RASTER STAGE IS ONE ENTRY. When a stage gains a live screen,
 * its entry changes from `kind: 'raster'` to `kind: 'live'` with the
 * component. The homepage, the Learn More page, the frame and the lightbox
 * need no change; the same preview and the same expanded view carry the new
 * implementation.
 *
 * ONE IMPLEMENTATION PER SCREEN. The component registered here is the same
 * one every other surface renders - for the Procurement Schedule that is the
 * homepage, the Learn More page, the unlisted team review page and the dev
 * lab. There is no homepage copy of a screen, and no raster is upscaled to
 * stand in for one.
 */
export type DemoScreenId =
  | 'scope-validation'
  | 'scope-gap-analysis'
  | 'commitment-capture'
  | 'product-register'
  | 'backward-scheduling';

type Viewing = {
  /**
   * Scale floor for the expanded view. The screen is held at or above this
   * on a short laptop viewport and panned, rather than shrunk until it is
   * unusable. Omitted means DEFAULT_MIN_SCALE, the one sizing rule shared by
   * all five screens.
   */
  minScale?: number;
};

export type DemoScreenEntry =
  | (Viewing & {
      kind: 'live';
      component: ComponentType;
      /**
       * The expanded view grants the screen inspection capabilities and
       * exposes it to assistive technology, because it then carries real
       * controls. A preview inside a page stays inert either way: the whole
       * preview is the enlarge target.
       */
      interactive?: boolean;
    })
  | (Viewing & {
      /**
       * The stage's capture, `<file>-{800,1448}.webp` in
       * public/assets/methodology, named by the stage content. The preview
       * shows it as before; the expanded view shows the same capture at up
       * to its native size, never upscaled. Nothing in it is a control, and
       * nothing is pretended to be.
       */
      kind: 'raster';
    });

/** The expanded view never scales a screen below this. */
export const DEFAULT_MIN_SCALE = 0.8;

export const DEMO_SCREENS: Record<DemoScreenId, DemoScreenEntry> = {
  'scope-validation': { kind: 'live', component: ScopeValidationScreen },
  'scope-gap-analysis': { kind: 'live', component: ScopeGapAnalysisScreen },
  'commitment-capture': { kind: 'live', component: CommitmentRegisterScreen },
  'product-register': { kind: 'live', component: ProductRegisterScreen },
  'backward-scheduling': { kind: 'live', component: ProcurementScheduleScreen, interactive: true },
};

export function hasDemoScreen(stageId: string): stageId is DemoScreenId {
  return stageId in DEMO_SCREENS;
}
