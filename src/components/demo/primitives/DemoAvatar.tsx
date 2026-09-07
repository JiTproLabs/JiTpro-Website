/**
 * The monogram avatar. Extracted as a primitive because the approved screen
 * demonstrates genuine reuse: it appears in the table's Commitment Owner cell
 * at 25px and in the detail panel's owner block at 34px, with identical
 * treatment at both sizes. Nothing else about it varies.
 */
export default function DemoAvatar({
  initials,
  size = 25,
}: {
  initials: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: '#f0f0f0',
        color: 'var(--jpd-text-strong)',
        fontSize: size * 0.4,
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {initials}
    </span>
  );
}
