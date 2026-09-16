import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { FIELD_GUIDE_COPY, type LeadMagnetPlacement } from '../../content/leadMagnets';
import LeadCaptureForm from './LeadCaptureForm';
import './dialog.css';

/**
 * The lead-capture dialog, to Design System §28.1 (approved 2026-09-12).
 *
 * A native `<dialog>` opened with `showModal()`, chosen for the same reason
 * DemoLightbox was: the platform then owns focus trapping, background
 * inertness, Escape, and top-layer stacking, and none of those is
 * reimplemented. Escape is routed through the `cancel` event so React unmounts
 * the dialog through the same path a Close click takes, which is what makes
 * focus restoration reliable.
 *
 * FOCUS. On open, focus moves to the email field; `autoFocus` is not used
 * because a `<dialog>` that has not been shown is `display: none`, so the
 * field cannot take focus until after `showModal()`. On close, focus returns
 * to the control that opened it, which the CTA owns.
 *
 * ENTRANCE. 160ms opacity only, and none at all under
 * `prefers-reduced-motion` (§28.1, §46.5). No scale, no slide.
 *
 * This component is lazy-loaded by the CTA, so nothing here, including the
 * form and its Turnstile integration, is in the homepage bundle until a
 * visitor asks for the guide.
 */

export type LeadMagnetDialogProps = {
  placement: LeadMagnetPlacement;
  pagePath: string;
  onClose: () => void;
};

export default function LeadMagnetDialog({ placement, pagePath, onClose }: LeadMagnetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const copy = FIELD_GUIDE_COPY.dialog;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    // Focus the first field. It cannot be focused before showModal(), because
    // a closed <dialog> is display: none.
    dialog.querySelector<HTMLInputElement>('input[type="email"]')?.focus();

    // Escape raises `cancel`. Routing it through onClose means every route out
    // of the dialog is the same one, so focus restoration cannot diverge.
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', onCancel);

    // <dialog> makes the background inert but does not lock its scroll.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.removeEventListener('cancel', onCancel);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClick={(event) => {
        // The dialog element itself is the backdrop, so a click that lands on
        // it rather than on the panel means "outside".
        if (event.target === dialogRef.current) onClose();
      }}
      className="jp-lead-dialog"
    >
      <div className="jp-lead-dialog__panel">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={headingId} className="text-2xl font-semibold tracking-tight text-jp-text-primary">
              {copy.heading}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-jp-text-secondary">{copy.subline}</p>
          </div>

          {/* Viewer chrome, not a second call to action (§28.1). */}
          <button
            type="button"
            onClick={onClose}
            className="jp-lead-dialog__close"
          >
            {copy.close}
            <X size={15} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <LeadCaptureForm placement={placement} pagePath={pagePath} />
      </div>
    </dialog>
  );
}
