import { useSearchParams } from 'react-router-dom';

export default function AdminApproved() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || 'the investor';
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-10 max-w-md text-center">
        <h1 className="text-2xl font-bold text-amber-500 mb-4">Access Granted</h1>
        <p className="text-slate-300 leading-relaxed">
          Access has been granted to <strong className="text-slate-100">{name}</strong>
          {email && <span className="text-slate-400"> ({email})</span>}.
        </p>
        <p className="text-slate-400 mt-4 text-sm">
          An email with their access link has been sent.
        </p>
      </div>
    </div>
  );
}
