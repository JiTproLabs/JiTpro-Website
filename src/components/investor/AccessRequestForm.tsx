import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Turnstile from '../Turnstile';

export default function AccessRequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    investment_interest: '',
    website: '', // honeypot
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => navigate('/'), 30000);
    return () => clearTimeout(timer);
  }, [submitted, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(''), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-investor-request`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          investment_interest: formData.investment_interest,
          website: formData.website,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setSubmitted(true);
    } catch {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <img
              src="/JiTpro-Website/assets/logo/JiTpro_Amber.svg"
              alt="JiTpro"
              className="h-10 mx-auto mb-10"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/logo/JiTpro_Amber.svg';
              }}
            />
            <h1 className="text-3xl font-bold text-slate-100 mb-6">
              Thank you for your interest in investing in JiTpro
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Please check your email for your access link. You will be redirected to the main site shortly.
            </p>
            <div className="text-sm text-slate-600">Redirecting in 30 seconds...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img
              src="/JiTpro-Website/assets/logo/JiTpro_Amber.svg"
              alt="JiTpro"
              className="h-10 mx-auto mb-8"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/logo/JiTpro_Amber.svg';
              }}
            />
            <h1 className="text-3xl font-bold text-slate-100 mb-3">Investor Access</h1>
            <p className="text-slate-400">
              Request access to the JiTpro investor briefing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm text-slate-400 mb-1">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm text-slate-400 mb-1">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="investment_interest" className="block text-sm text-slate-400 mb-1">
                What interests you about JiTpro? <span className="text-slate-600">(optional)</span>
              </label>
              <textarea
                id="investment_interest"
                name="investment_interest"
                rows={3}
                value={formData.investment_interest}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Honeypot — hidden from real users */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <Turnstile onToken={handleTurnstileToken} onExpire={handleTurnstileExpire} />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Access'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-8">
            Access is reviewed manually. You will receive an email once approved.
          </p>
        </div>
      </div>
    </div>
  );
}
