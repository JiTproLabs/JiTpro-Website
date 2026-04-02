import { Outlet, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import InvestorNav from './InvestorNav';
import InvestorFooter from './InvestorFooter';
import AccessRequestForm from './AccessRequestForm';

const TOKEN_KEY = 'jitpro_investor_token';

export default function InvestorLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const verifyToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-investor-token`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) return false;
      const data = await response.json();
      return data.valid === true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      // Skip auth on localhost for development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // Check for token in URL first (magic link click)
      const urlToken = searchParams.get('token');
      if (urlToken) {
        const valid = await verifyToken(urlToken);
        if (valid) {
          localStorage.setItem(TOKEN_KEY, urlToken);
          // Remove token from URL without reload
          searchParams.delete('token');
          setSearchParams(searchParams, { replace: true });
          setAuthorized(true);
          setChecking(false);
          return;
        }
      }

      // Check localStorage
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const valid = await verifyToken(storedToken);
        if (valid) {
          setAuthorized(true);
          setChecking(false);
          return;
        }
        // Token revoked or invalid — clear it
        localStorage.removeItem(TOKEN_KEY);
      }

      setAuthorized(false);
      setChecking(false);
    };

    check();
  }, [searchParams, setSearchParams, verifyToken]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Verifying access...</div>
      </div>
    );
  }

  if (!authorized) {
    return <AccessRequestForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <InvestorNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <InvestorFooter />
    </div>
  );
}
