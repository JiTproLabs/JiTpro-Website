import { useState } from 'react';

export default function Demo() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-demo-request`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit request. Please try again or contact us directly.');
      console.error('Error submitting demo request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-50 mb-6">
            Request received
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            We'll contact you within one business day to schedule your demonstration of JiTpro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            Request a demonstration
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
See how JiTpro enforces procurement timing and maintains accountability across your projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300/30"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-slate-200 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300/30"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-200 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300/30"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-200 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300/30"
              >
                <option value="">Select your role</option>
                <option value="gc">General Contractor</option>
                <option value="owner">Owner / Developer</option>
                <option value="architect">Architect</option>
                <option value="engineer">Engineer</option>
                <option value="executive">Executive / Operations</option>
                <option value="other">Other</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? 'Submitting...' : 'Request Demo'}
            </button>
          </form>

          <div className="mt-12 pt-12 border-t border-white/10">
            <h3 className="font-heading text-xl font-bold text-slate-100 mb-4">
              What you'll see
            </h3>
            <ul className="space-y-3 text-lg text-slate-300">
              <li>How JiTpro enforces procurement decision deadlines</li>
              <li>Approval routing and accountability tracking</li>
              <li>Delay attribution and locked audit trails</li>
              <li>Implementation process for your organization</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
