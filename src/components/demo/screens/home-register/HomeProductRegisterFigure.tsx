import { useLayoutEffect, useRef, useState } from 'react';
import DemoStatusBadge from '../../primitives/DemoStatusBadge';
import HomeProductRegister from './HomeProductRegister';
import { HOME_CANVAS, HOME_PAGE, SELECTED, workdaysLabel } from './homeRegisterData';
import '../../tokens.css';

/**
 * Homepage Step 01 figure (Design System Section 52.3).
 *
 *   lg and up   the curated Product Register canvas, scaled as one unit to
 *               the content width. At lg the scale keeps its text readable.
 *   below lg    a simplified card of the selected product - real text, in the
 *               same visual language - rather than the canvas shrunk past
 *               legibility. It is a homepage presentation, not a claim that
 *               the application has a mobile layout.
 *
 * Scaling follows DemoScreenFrame: `aspect-ratio` reserves the height before
 * script runs, the scale is a plain 2D transform from the top-left, and
 * nothing promotes the canvas to its own composited layer, so text stays
 * crisp.
 */

const LABEL =
  `JiTpro Product Register for the ${HOME_PAGE.project}, showing six of the project's products. ` +
  `Selected: ${SELECTED.name}, status Pending, ${workdaysLabel(SELECTED.fabricationWorkdays)} of fabrication, ` +
  `required on site ${SELECTED.requiredOnSite}.`;

function ScaledRegister() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / HOME_CANVAS.w);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={LABEL}
      className="relative w-full overflow-hidden rounded-[14px] border border-jp-ink-secondary/20"
      style={{ aspectRatio: `${HOME_CANVAS.w} / ${HOME_CANVAS.h}` }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: HOME_CANVAS.w,
          height: HOME_CANVAS.h,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {scale > 0 && <HomeProductRegister />}
      </div>
    </div>
  );
}

function SelectedProductCard() {
  const fields = [
    { label: 'Category', value: SELECTED.category },
    { label: 'Trade', value: SELECTED.trade },
    { label: 'Supplier', value: SELECTED.supplier },
    { label: 'Fabrication Duration', value: workdaysLabel(SELECTED.fabricationWorkdays) },
  ];
  return (
    <div
      className="jpd overflow-hidden rounded-[14px] border border-jp-ink-secondary/20"
      style={{ background: 'var(--jpd-surface)', color: 'var(--jpd-text)' }}
    >
      <div className="px-5 py-3 text-[0.8125rem] font-semibold" style={{ background: 'var(--jpd-surface-header)', color: 'var(--jpd-text-secondary)' }}>
        {HOME_PAGE.title} · {HOME_PAGE.project}
      </div>
      <div className="relative px-5 pt-4 pb-5" style={{ background: 'var(--jpd-row-tint)' }}>
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: 'var(--jpd-row-bar)' }} />
        <p className="text-[1.125rem] font-bold leading-snug">{SELECTED.name}</p>
        <p className="mt-0.5 text-[0.875rem]" style={{ color: 'var(--jpd-text-secondary)' }}>
          {SELECTED.description}
        </p>
        <div className="mt-3">
          <DemoStatusBadge status={SELECTED.status} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 px-5 py-4">
        {fields.map((f) => (
          <div key={f.label}>
            <dt className="text-[0.75rem] font-semibold" style={{ color: 'var(--jpd-text-secondary)' }}>
              {f.label}
            </dt>
            <dd className="mt-0.5 text-[0.9375rem]">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t px-5 py-4" style={{ borderColor: 'var(--jpd-divider)' }}>
        <p className="text-[0.75rem] font-semibold" style={{ color: 'var(--jpd-text-secondary)' }}>
          Required On-Site
        </p>
        <p className="mt-0.5 text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em]">{SELECTED.requiredOnSite}</p>
      </div>
    </div>
  );
}

export default function HomeProductRegisterFigure() {
  return (
    <figure className="m-0">
      <div className="hidden lg:block">
        <ScaledRegister />
      </div>
      <div className="lg:hidden">
        <SelectedProductCard />
      </div>
      <figcaption className="mt-3 text-[0.8125rem] leading-snug text-jp-ink-secondary">
        Representative demonstration data. The selected product is followed through each of the steps below.
      </figcaption>
    </figure>
  );
}
