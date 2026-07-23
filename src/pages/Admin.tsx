import { useState, useEffect, useCallback } from 'react';

interface InvestorRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  investment_interest: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
  revoked_at: string | null;
}

type Tab = 'pending' | 'approved' | 'revoked';

const ADMIN_PASSWORD_KEY = 'jitpro_admin_password';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [records, setRecords] = useState<InvestorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const storedPassword = sessionStorage.getItem(ADMIN_PASSWORD_KEY);

  const fetchRecords = useCallback(async (pw: string) => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-investor-requests`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ password: pw }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
          setAuthenticated(false);
          setError('Invalid password');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setRecords(data.records || []);
      setAuthenticated(true);
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, pw);
    } catch {
      setError('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storedPassword) {
      fetchRecords(storedPassword);
    }
  }, [storedPassword, fetchRecords]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(password);
  };

  const handleApprove = async (id: string) => {
    const pw = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!pw) return;
    setActionLoading(id);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/approve-investor?id=${id}&key=${encodeURIComponent(pw)}`;
      await fetch(apiUrl);
      await fetchRecords(pw);
    } catch {
      setError('Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async (id: string) => {
    const pw = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!pw) return;
    setActionLoading(id);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revoke-investor`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ id, password: pw }),
      });
      await fetchRecords(pw);
    } catch {
      setError('Failed to revoke');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = records.filter((r) => r.status === tab);

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-100 mb-6 text-center">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-amber-500 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Log In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Investor Access Admin</h1>
          <button
            onClick={() => fetchRecords(sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '')}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'approved', 'revoked'] as Tab[]).map((t) => {
            const count = records.filter((r) => r.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  tab === t
                    ? 'bg-amber-500 text-slate-900 font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500">No {tab} requests.</p>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-4 py-3 text-slate-500 font-medium">Name</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Company</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Interest</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Requested</th>
                  {tab !== 'pending' && (
                    <th className="px-4 py-3 text-slate-500 font-medium">
                      {tab === 'approved' ? 'Approved' : 'Revoked'}
                    </th>
                  )}
                  {tab !== 'revoked' && (
                    <th className="px-4 py-3 text-slate-500 font-medium">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-slate-700/50 last:border-0">
                    <td className="px-4 py-3 text-slate-200">{record.name}</td>
                    <td className="px-4 py-3 text-slate-400">{record.email}</td>
                    <td className="px-4 py-3 text-slate-400">{record.company}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-48 truncate">
                      {record.investment_interest || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(record.created_at)}
                    </td>
                    {tab !== 'pending' && (
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(tab === 'approved' ? record.approved_at : record.revoked_at)}
                      </td>
                    )}
                    {tab !== 'revoked' && (
                      <td className="px-4 py-3">
                        {tab === 'pending' ? (
                          <button
                            onClick={() => handleApprove(record.id)}
                            disabled={actionLoading === record.id}
                            className="px-3 py-1 bg-amber-500 text-slate-900 text-xs font-semibold rounded-sm hover:bg-amber-400 disabled:opacity-50"
                          >
                            {actionLoading === record.id ? '...' : 'Approve'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevoke(record.id)}
                            disabled={actionLoading === record.id}
                            className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-sm border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
                          >
                            {actionLoading === record.id ? '...' : 'Revoke'}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
