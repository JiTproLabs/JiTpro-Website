import { ReactNode } from 'react';

interface JiTproWordmarkProps {
  variant?: 'amber' | 'slate';
  className?: string;
}

const COLORS = {
  amber: '#f59e0b',
  slate: '#1e293b',
} as const;

export default function JiTproWordmark({ variant = 'amber', className = '' }: JiTproWordmarkProps) {
  const fill = COLORS[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="365 155 670 335"
      role="img"
      aria-label="JiTpro"
      className={className}
      style={{ height: '1.5em', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* JiT main letterform */}
      <path
        d="M813.29,236.75v41.7l-153.9.7v133.5h-42.8v-133.5l-106.4-.4v68.9c0,17-1.3,29.9-3.9,38.8s-7.6,15.9-15.1,21.1-30.3,7.7-43.1,7.7c-73,0-69.5-46.7-69.5-46.7l51.6.6s2.9,10.1,15.5,10.1,16.6-5.6,18.3-10.7c0,0,1.8-3.3,2.1-20.9v-69.1h-41.3v-41.8h388.5Z"
        fill={fill}
      />
      {/* i stem */}
      <path
        d="M583.49,294.25l.3,118.3h-43.5l.5-118.3h42.8-.1Z"
        fill={fill}
      />
      {/* p */}
      <path
        d="M729.69,411.75l-1.3,66.6-38.2-.6v-181.8h57.3c14.3,0,25.2,2.2,32.6,6.7,7.4,4.4,13.3,11.2,17.7,20.4,4.4,9.1,6.5,19.4,6.5,30.8,0,17.3-4.5,31.3-13.4,42-8.9,10.7-20.8,16-35.7,16h-25.7.2v-.1ZM729.69,377.85l19.2-.6c15.2,0,22.9-7.9,22.9-23.8s-7-22.4-21.1-22.4l-20.9.4v46.5h-.1v-.1Z"
        fill={fill}
      />
      {/* r */}
      <path
        d="M863.29,411.95h-38.9v-115.3l35.9-.4v13.8c10-16.3,21.6-15.8,28.9-15.1,16.5,1.7,20.1,5,20.1,5l-18.2,35.2c-2.8-.8-5.4-1.1-7.6-1.1-13.4,0-20.1,8.4-20.1,25.1v52.8h-.1Z"
        fill={fill}
      />
      {/* o */}
      <path
        d="M962.59,414.35c-17.3,0-31-6-41.1-17.9-10.2-11.9-15.2-25.9-15.2-41.9s5.3-31.6,15.9-43.1c10.6-11.5,24.4-17.2,41.4-17.2s30.9,5.7,41.3,17c10.4,11.3,15.6,25.6,15.6,42.6s-5.3,31.6-15.8,43.1c-10.5,11.5-24.5,17.3-42,17.3h-.1v.1ZM962.49,381.05c9.9,0,14.6-2.2,18-6.9s4.1-12.6,4.1-22.6-2.2-17.6-5.3-21.8c-3.1-4.3-8.7-6.4-16.7-6.4s-12.8,2.2-16.2,6.6-5.1,11.7-5.1,21.8,1.8,19.8,5.3,23.6c3.5,3.8,8.8,5.8,15.9,5.8h0v-.1Z"
        fill={fill}
      />
      {/* i dot */}
      <ellipse cx="562.99" cy="195.95" rx="29.4" ry="29.1" fill={fill} />
    </svg>
  );
}

export function brandText(text: string, variant: 'amber' | 'slate' = 'slate', className?: string): ReactNode {
  const parts = text.split(/(JiTpro|JITpro|JITPRO)/gi);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^ji?t?pro$/i.test(part) ? <JiTproWordmark key={i} variant={variant} className={className} /> : part
  );
}
