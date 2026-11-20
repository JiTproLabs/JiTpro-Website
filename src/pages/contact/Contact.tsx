import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContactForm } from './submitContact';
import Turnstile from '../../components/Turnstile';

/**
 * The unified contact form — the site's one contact experience for
 * prospective customers (consolidation approved 2026-08-26). Replaces the
 * Contractor / Owner / Architect contact pages, whose legacy routes redirect
 * here.
 *
 * THE CONVERSION PAGE, NOT A CONTACT PAGE (rebuilt 2026-09-03). Everyone who
 * lands here arrived by clicking a promise: "Protect your next project" or
 * "Start with one project". They have already read the argument. This page
 * therefore does not restate it — it confirms the promise, lowers the last
 * resistance, and gets out of the way of the form.
 *
 * The progression the page has to carry, in order:
 *
 *   I want to protect my next project           eyebrow and H1
 *   I can start with one project                the intro paragraph
 *   JiTpro understands what I am dealing with   the intro paragraph
 *   the next step is just a conversation        the H2 and the CTA label
 *   I will fill this out                        the form
 *
 * WHAT MUST NOT COME BACK: a methodology explanation, a feature list, pricing,
 * an implementation story, or anything reproducing the homepage or
 * /learn-more. A visitor who needs any of that has not clicked a CTA yet, and
 * putting it here costs the conversion of everyone who has.
 *
 * DELIBERATELY MINIMAL. This is a conversation starter, not a qualification
 * form: first name, last name, company name, email, role, note — nothing
 * else. No project qualification questions, no schedule-call step, no phone
 * field. Adding fields here is a product decision, not a form tweak.
 *
 * COMPANY NAME (restored 2026-11-19, founder direction): required, as a
 * second way to identify a prospect if they mistype their email. It is
 * stored in the existing legacy `leads.company` column (live schema checked
 * 2026-11-19: string, nullable) and shown in the internal notification. Not
 * to be confused with the hidden `company_website` honeypot below, which is
 * spam protection and must stay as it is.
 *
 * PIPELINE (unchanged): submitContactForm() → the submit-contact edge
 * function (Turnstile verified server-side) → the existing `leads` table →
 * database webhook → Resend notification. The other legacy qualification
 * columns on `leads` are nullable (verified against the live schema
 * 2026-08-26) and simply stay NULL on new rows. Hidden metadata still sent: intent, source,
 * page. `role` carries the visitor's dropdown selection using the values
 * already in production ('contractor' / 'owner' / 'architect') plus 'other'.
 *
 * PROTECTION (unchanged pattern): honeypot field silently drops bots
 * client-side; Turnstile token is required client-side and verified
 * server-side.
 *
 * THE SUBMIT LABEL IS A CLAIM (2026-09-03). "Start the conversation" is what
 * pressing the button actually does. It must never become "Protect my next
 * project" or any label implying the submission is itself an engagement:
 * naming an action as more than it is, on the one control that converts, is
 * the kind of overclaim §20.1 exists to prevent.
 *
 * STYLING: the established contact-page visual language, expressed in
 * approved --jp-* tokens (§8.8, §45 — new code conforms immediately; the
 * legacy pages' literal classes do not carry over). The inline error state
 * uses neutral tokens because no semantic error color is approved (§8.3);
 * inventing one in a component is prohibited (§49).
 *
 * AMBER (§48.7): exactly two elements — the eyebrow and the submit button.
 * The reassurance block below the form carries none, which is what keeps it
 * lighter than the form it supports.
 *
 * NO EM DASHES in customer-facing copy on this page.
 */

const ROLE_OPTIONS = [
  { value: 'contractor', label: 'General Contractor' },
  { value: 'owner', label: 'Project Owner' },
  { value: 'architect', label: 'Architect' },
  { value: 'other', label: 'Other' },
] as const;

/**
 * The last three objections, answered in one line each (approved copy,
 * 2026-09-03). They sit BELOW the form at every width, so the mobile path
 * from headline to first field stays short, and they are set in the muted
 * ramp with hairline separation rather than as cards: this block supports the
 * form and must never compete with it (§48.2 — most content does not need a
 * card).
 */
const REASSURANCE = [
  {
    title: 'No sales pitch.',
    body: 'We’ll start by understanding your project and what you’re experiencing.',
  },
  {
    title: 'Start with one project.',
    body: 'You don’t need to change how your entire company operates to get started.',
  },
  {
    title: 'Built by contractors.',
    body: 'You’ll be talking with people who understand the problems you’re trying to solve.',
  },
] as const;

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [note, setNote] = useState('');

  // Honeypot
  const [honeypot, setHoneypot] = useState('');

  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState('');
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(''), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detected
    if (honeypot) return;

    if (!turnstileToken) {
      setError('Please complete the verification challenge.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitContactForm(
        {
          role,
          intent: 'contact',
          source: 'website',
          page: '/contact',
          firstName,
          lastName,
          company,
          email,
          message: note,
        },
        turnstileToken
      );
      navigate('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-jp-border/30 bg-jp-surface px-4 py-3 text-lg text-jp-text-primary placeholder:text-jp-text-muted/70 focus:border-jp-brand-amber focus:outline-hidden focus:ring-2 focus:ring-jp-brand-amber-active/30';
  const labelClass = 'block text-sm font-semibold text-jp-text-secondary mb-2';

  return (
    <div className="min-h-screen bg-jp-background text-jp-text-primary">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          {/* THE PROMISE, CONFIRMED. Authored in sentence case and uppercased
              in CSS so assistive technology receives normally-cased text
              (§7.7), in the data face at small size with increased tracking
              (§7.3). It repeats the words on the button the visitor just
              pressed, which is the whole job of the first line on a
              conversion page. */}
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-jp-brand-amber">
            Protect your next project
          </p>

          <h1 className="mt-6 font-heading text-[2.125rem] font-extrabold leading-[1.08] tracking-[-0.025em] text-balance text-jp-text-primary sm:text-[2.5rem] lg:text-[3rem]">
            Ready to take control of your next project?
          </h1>

          {/* One paragraph. The bolded opening is the commitment-shrinking
              phrase the visitor has already seen, so it lands as continuity
              rather than as a new claim. */}
          <p className="mt-7 text-[1.0625rem] leading-[1.7] text-jp-text-secondary sm:text-[1.125rem] lg:text-[1.1875rem]">
            <strong className="font-semibold text-jp-text-primary">Start with one project.</strong>{' '}
            Tell us a little about your company and what you&rsquo;re building. We&rsquo;ll start with a conversation about where JiTpro can create early accountability and help your team get ahead of preventable problems.
          </p>

          {/* The turn from promise to action, marked by a hairline rather than
              a heavier divider (§48.6). Everything above is why; everything
              below is how. */}
          <div className="mt-12 border-t border-jp-border/12 pt-12">
            <h2 className="font-heading text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-jp-text-primary sm:text-[1.75rem]">
              Tell us about your project.
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                name="company_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className={labelClass}>Company Name *</label>
                <input
                  type="text"
                  id="company"
                  required
                  autoComplete="organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="role" className={labelClass}>Role *</label>
                <select
                  id="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select your role</option>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="note" className={labelClass}>Note *</label>
                <textarea
                  id="note"
                  required
                  rows={6}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Cloudflare Turnstile */}
              <Turnstile onToken={handleToken} onExpire={handleExpire} theme="dark" />

              {error && (
                <div role="alert" className="rounded-lg border border-jp-border/30 bg-jp-surface p-4 text-jp-text-primary">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !turnstileToken}
                className="w-full rounded-lg bg-jp-brand-amber px-8 py-4 text-lg font-semibold text-jp-background transition-colors duration-200 ease-out hover:bg-jp-brand-amber-active focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-jp-text-primary motion-reduce:transition-none disabled:cursor-not-allowed disabled:bg-jp-surface disabled:text-jp-text-muted"
              >
                {loading ? 'Sending...' : 'Start the conversation'}
              </button>
            </form>
          </div>

          {/* The last three objections, after the form. A visitor who is
              already convinced never has to read them; one who hesitates at
              the button finds them exactly where the hesitation happens. */}
          <dl className="mt-14 grid gap-x-8 gap-y-8 border-t border-jp-border/12 pt-10 sm:grid-cols-3">
            {REASSURANCE.map((item) => (
              <div key={item.title}>
                <dt className="font-heading text-[1.0625rem] font-semibold leading-snug text-jp-text-primary">
                  {item.title}
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-[1.6] text-jp-text-muted">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>

          {/* The terminal beat. Without it the page stops on the third
              reassurance item rather than closing, and the three separate
              answers never resolve into one idea. */}
          <p className="mt-12 border-t border-jp-border/12 pt-10 font-heading text-[1.125rem] font-semibold leading-[1.4] tracking-[-0.01em] text-balance text-jp-text-primary sm:text-[1.25rem]">
            One project. One conversation. A better way to get ahead of what makes construction expensive.
          </p>
        </div>
      </section>
    </div>
  );
}
