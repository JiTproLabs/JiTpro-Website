interface InvestorSectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function InvestorSectionHeader({ title, subtitle, align = 'left' }: InvestorSectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed" style={align === 'center' ? { margin: '0 auto' } : undefined}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
