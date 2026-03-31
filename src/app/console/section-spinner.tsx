/**
 * Spotlight Trace spinner built from the § (section sign).
 *
 * A faint outline of § is always visible, while a brighter segment
 * continuously traces around it.  An optional CSS shimmer gradient
 * sweeps through the fill behind the outline.
 */
export function SectionSpinner({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const id = `section-spinner-${size}`;
  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <svg
        width={size}
        height={size}
        viewBox="0 0 72 72"
        overflow="visible"
        style={{ display: "block" }}
      >
        <style>{`
          @keyframes spotlight-run {
            0%   { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -500; }
          }
          @keyframes shimmer-sweep {
            0%   { stop-opacity: 0; }
            40%  { stop-opacity: .35; }
            60%  { stop-opacity: .35; }
            100% { stop-opacity: 0; }
          }
          #${id}-bg {
            font-family: 'Merriweather', Georgia, serif;
            font-weight: 900;
            font-size: 3rem;
            fill: none;
            stroke: #d1d5db;
            stroke-width: 0.7;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          #${id}-hl {
            font-family: 'Merriweather', Georgia, serif;
            font-weight: 900;
            font-size: 3rem;
            fill: none;
            stroke: #9ca3af;
            stroke-width: 1;
            stroke-dasharray: 80 420;
            stroke-linecap: round;
            stroke-linejoin: round;
            animation: spotlight-run 2.5s linear infinite;
          }
          #${id}-fill {
            font-family: 'Merriweather', Georgia, serif;
            font-weight: 900;
            font-size: 3rem;
            stroke: none;
            fill: url(#${id}-grad);
          }
          #${id}-s1 { animation: shimmer-sweep 2.5s ease-in-out infinite; }
          #${id}-s2 { animation: shimmer-sweep 2.5s ease-in-out 0.4s infinite; }
          #${id}-s3 { animation: shimmer-sweep 2.5s ease-in-out 0.8s infinite; }
        `}</style>
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="72" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0" />
            <stop id={`${id}-s1`} offset="30%" stopColor="#9ca3af" stopOpacity="0" />
            <stop id={`${id}-s2`} offset="50%" stopColor="#9ca3af" stopOpacity="0" />
            <stop id={`${id}-s3`} offset="70%" stopColor="#9ca3af" stopOpacity="0" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0" />
          </linearGradient>
        </defs>
        <text id={`${id}-fill`} x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" transform="rotate(90, 36, 36)">§</text>
        <text id={`${id}-bg`} x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" transform="rotate(90, 36, 36)">§</text>
        <text id={`${id}-hl`} x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" transform="rotate(90, 36, 36)">§</text>
      </svg>
    </span>
  );
}
