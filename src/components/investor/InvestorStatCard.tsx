import { useEffect, useRef, useState } from 'react';
import type { InvestorStat } from '../../content/investorStats';

interface InvestorStatCardProps {
  stat: InvestorStat;
}

export default function InvestorStatCard({ stat }: InvestorStatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-slate-800 border border-slate-700 rounded-lg p-6 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
        {stat.value}
        {stat.verificationStatus !== 'verified' && (
          <sup className="text-xs text-slate-500 ml-1 font-normal">{stat.footnoteKey}</sup>
        )}
      </div>
      <div className="text-sm text-slate-300 leading-relaxed">{stat.label}</div>
      <div className="mt-3 text-xs text-slate-500">{stat.sourceShortName}</div>
    </div>
  );
}
