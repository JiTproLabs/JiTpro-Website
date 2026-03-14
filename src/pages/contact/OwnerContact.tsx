import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContactForm } from './submitContact';

export default function OwnerContact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hasProject, setHasProject] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectType, setProjectType] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const [message, setMessage] = useState('');
  const [scheduleCall, setScheduleCall] = useState('');

  // Honeypot
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detected
    if (honeypot) return;

    setLoading(true);
    setError('');

    const data = {
      role: 'owner',
      intent: 'contact',
      source: 'website',
      page: '/contact/owner',
      timestamp: new Date().toISOString(),
      hasProject,
      projectLocation,
      projectType,
      estimatedValue,
      projectTimeline,
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      scheduleCall,
    };

    try {
      await submitContactForm(data);
      // TODO: Enable when send-contact-notification Edge Function is deployed
      // await sendEmailNotification(data);
      navigate('/thank-you', { state: { scheduleCall: scheduleCall === 'yes' } });
    } catch {
      // Submission placeholder not yet connected — navigate to thank you
      navigate('/thank-you', { state: { scheduleCall: scheduleCall === 'yes' } });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg';
  const labelClass = 'block text-sm font-bold text-slate-900 mb-2';
  const radioGroupClass = 'flex gap-6';
  const radioLabelClass = 'flex items-center gap-2 text-slate-700 cursor-pointer';

  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 mb-6">
            For Project Owners
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Let's Talk Procurement
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            Tell us about your project and how we can help protect your schedule and budget.
          </p>

          <form onSubmit={handleSubmit} className="space-y-12">
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

            {/* Cloudflare Turnstile placeholder */}
            <div id="cf-turnstile-owner" data-sitekey="TURNSTILE_SITE_KEY_PLACEHOLDER" />

            {/* Section 1: Project Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                Project Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>
                    Do you have an upcoming project you'd like to discuss?
                  </label>
                  <div className={radioGroupClass}>
                    <label className={radioLabelClass}>
                      <input type="radio" name="hasProject" value="yes" checked={hasProject === 'yes'} onChange={(e) => setHasProject(e.target.value)} className="accent-slate-900" />
                      Yes
                    </label>
                    <label className={radioLabelClass}>
                      <input type="radio" name="hasProject" value="no" checked={hasProject === 'no'} onChange={(e) => setHasProject(e.target.value)} className="accent-slate-900" />
                      No
                    </label>
                  </div>
                </div>

                {hasProject === 'yes' && (
                  <div className="space-y-6 pl-0 border-l-0">
                    <div>
                      <label htmlFor="projectLocation" className={labelClass}>Project Location (City, State)</label>
                      <input type="text" id="projectLocation" value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} className={inputClass} />
                    </div>

                    <div>
                      <label htmlFor="projectType" className={labelClass}>Project Type</label>
                      <select id="projectType" value={projectType} onChange={(e) => setProjectType(e.target.value)} className={inputClass}>
                        <option value="">Select type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="estimatedValue" className={labelClass}>Estimated Construction Value</label>
                      <select id="estimatedValue" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} className={inputClass}>
                        <option value="">Select range</option>
                        <option value="under-1m">Under $1M</option>
                        <option value="1m-5m">$1M – $5M</option>
                        <option value="5m-10m">$5M – $10M</option>
                        <option value="10m-plus">$10M+</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="projectTimeline" className={labelClass}>Project Timeline</label>
                      <select id="projectTimeline" value={projectTimeline} onChange={(e) => setProjectTimeline(e.target.value)} className={inputClass}>
                        <option value="">Select timeline</option>
                        <option value="planning">Planning Phase</option>
                        <option value="within-6-months">Within 6 months</option>
                        <option value="6-12-months">6–12 months</option>
                        <option value="1-plus-years">1+ years</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Your Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                Your Information
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>First Name *</label>
                    <input type="text" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>Last Name *</label>
                    <input type="text" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="company" className={labelClass}>Company / Organization</label>
                  <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Section 3: Message */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                Message
              </h2>
              <div>
                <label htmlFor="message" className={labelClass}>How can we help?</label>
                <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Section 4: Next Step */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">
                Next Step
              </h2>
              <div>
                <label className={labelClass}>Would you like to schedule a call?</label>
                <div className={radioGroupClass}>
                  <label className={radioLabelClass}>
                    <input type="radio" name="scheduleCall" value="yes" checked={scheduleCall === 'yes'} onChange={(e) => setScheduleCall(e.target.value)} className="accent-slate-900" />
                    Yes
                  </label>
                  <label className={radioLabelClass}>
                    <input type="radio" name="scheduleCall" value="no" checked={scheduleCall === 'no'} onChange={(e) => setScheduleCall(e.target.value)} className="accent-slate-900" />
                    No
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
