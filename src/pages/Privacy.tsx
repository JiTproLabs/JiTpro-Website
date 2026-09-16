import { useEffect } from 'react';
import {
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from '../content/privacyNotice';

/**
 * `/privacy`. The approved privacy notice (lead-gen plan §27), linked from the
 * capture form's fine print and, from Sprint 5, from the footer.
 *
 * Brought forward from Sprint 5 into Sprint 4 with Jeff's approval
 * (2026-09-16) so the fine-print link resolves correctly throughout Sprint 4
 * QA rather than falling through to the catch-all route.
 *
 * Content only. Every sentence comes from `src/content/privacyNotice.ts`,
 * which holds the approved text; this file is layout. The page is not
 * extended beyond the approved content, and it carries the legal-review
 * designation until L-3 closes.
 */
export default function Privacy() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Privacy notice | JiTpro';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="bg-jp-background">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <h1 className="text-3xl font-semibold tracking-tight text-jp-text-primary sm:text-4xl">
          {PRIVACY_INTRO.title}
        </h1>

        {PRIVACY_LAST_UPDATED && (
          <p className="mt-4 text-sm text-jp-text-muted">Last updated: {PRIVACY_LAST_UPDATED}</p>
        )}

        {/* L-3. Removed when legal review closes, before production launch. */}
        <p className="mt-6 rounded-2xl border border-jp-border/15 bg-jp-surface p-6 text-[0.9375rem] leading-relaxed text-jp-text-secondary">
          {PRIVACY_INTRO.reviewNotice}
        </p>

        <div className="mt-10 space-y-8">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold tracking-tight text-jp-text-primary">{section.heading}</h2>

              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-jp-text-secondary">
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 leading-relaxed text-jp-text-secondary">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-jp-text-muted" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.after?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-jp-text-secondary">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
