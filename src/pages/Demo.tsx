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
      <div className="px-6 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            Request received
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We'll contact you within one business day to schedule your demonstration of JiTpro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Request a demonstration
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
See how JiTpro enforces procurement timing and maintains accountability across your projects.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-bold text-slate-900 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-bold text-slate-900 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-300 text-slate-900 focus:border-slate-900 focus:outline-none text-lg"
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
              <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white px-8 py-4 text-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Demo'}
            </button>
          </form>

          <div className="mt-12 pt-12 border-t-2 border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              What you'll see
            </h3>
            <ul className="space-y-3 text-lg text-slate-600">
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
