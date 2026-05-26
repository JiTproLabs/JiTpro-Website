const DX = 0.7;
const DY = -0.45;

function dp(x: number, y: number, d: number): [number, number] {
  return [Math.round(x + d * DX), Math.round(y + d * DY)];
}

function pts(...coords: [number, number][]): string {
  return coords.map(c => `${c[0]},${c[1]}`).join(' ');
}

function lo(p: number, t: number): number {
  return Math.min(1, Math.max(0, (p - t) / 0.15));
}

const edge = 'rgb(251,191,36)';
const edgeDim = 'rgb(180,130,45)';
const glow = 'rgba(251,191,36,0.35)';
const glowDeep = 'rgba(251,191,36,0.18)';

interface Props { buildProgress: number }

export default function ArchitecturalOutcome({ buildProgress: p }: Props) {
  // Volume definitions: [x1, y_top, x2, y_bottom, depth]
  const LW = { x1: 935, yt: 385, x2: 1075, yb: 520, d: 36 };   // left wing
  const MV = { x1: 1075, yt: 215, x2: 1250, yb: 520, d: 42 };  // main volume
  const RW = { x1: 1282, yt: 300, x2: 1398, yb: 520, d: 36 };  // right wing

  function volume(v: typeof LW, thick: number) {
    const { x1, yt, x2, yb, d } = v;
    const fbl: [number,number] = [x1, yb]; const ftl: [number,number] = [x1, yt];
    const ftr: [number,number] = [x2, yt]; const fbr: [number,number] = [x2, yb];
    const bbl = dp(x1, yb, d); const btl = dp(x1, yt, d);
    const btr = dp(x2, yt, d); const bbr = dp(x2, yb, d);
    return { fbl, ftl, ftr, fbr, bbl, btl, btr, bbr, thick };
  }

  const lw = volume(LW, 1.2);
  const mv = volume(MV, 1.6);
  const rw = volume(RW, 1.2);

  return (
    <g aria-hidden="true">
      <defs>
        <filter id="wglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
        <filter id="wglowStr" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
        </filter>
        <filter id="hambient" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
        </filter>
        <filter id="edgeBloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Deep ambient halo */}
      <ellipse cx={1170} cy={400} rx={320} ry={230} fill="rgba(180,120,30,0.05)" filter="url(#hambient)"
        style={{ opacity: p * 0.9, transition: 'opacity 2s' }} />

      {/* ===== FOUNDATION / GROUND ===== */}
      <g style={{ opacity: lo(p, 0), transition: 'opacity 1.5s' }}>
        <line x1="910" y1="520" x2="1430" y2="520" stroke={edgeDim} strokeWidth={1.5} opacity={0.5} />
        {/* Ground depth line */}
        <line x1={910 + 36 * DX} y1={520 + 36 * DY} x2={1430 + 36 * DX} y2={520 + 36 * DY} stroke={edgeDim} strokeWidth={0.5} opacity={0.15} />
        {/* Ground reflection glow */}
        <rect x="920" y="520" width="500" height="40" fill="rgba(251,191,36,0.02)" filter="url(#wglow)" />
      </g>

      {/* ===== 3D VOLUME SURFACES ===== */}
      <g style={{ opacity: lo(p, 0.1), transition: 'opacity 1.5s' }}>
        {[lw, mv, rw].map((v, vi) => (
          <g key={`vol${vi}`}>
            {/* Front face fill */}
            <polygon points={pts(v.fbl, v.ftl, v.ftr, v.fbr)} fill="rgba(15,10,5,0.5)" />
            {/* Right side face fill (darker) */}
            <polygon points={pts(v.fbr, v.ftr, v.btr, v.bbr)} fill="rgba(10,7,3,0.6)" />
            {/* Top face fill */}
            <polygon points={pts(v.ftl, v.ftr, v.btr, v.btl)} fill="rgba(25,18,8,0.35)" />
          </g>
        ))}
      </g>

      {/* ===== WIREFRAME EDGES (bloom layer) ===== */}
      <g style={{ opacity: lo(p, 0.18), transition: 'opacity 1.5s' }}>
        {[lw, mv, rw].map((v, vi) => (
          <g key={`bloom${vi}`} filter="url(#edgeBloom)" opacity={0.35}>
            {/* Front face edges */}
            <polygon points={pts(v.fbl, v.ftl, v.ftr, v.fbr)} fill="none" stroke={edge} strokeWidth={v.thick * 1.5} />
            {/* Side + top edges */}
            <line x1={v.ftr[0]} y1={v.ftr[1]} x2={v.btr[0]} y2={v.btr[1]} stroke={edge} strokeWidth={v.thick} />
            <line x1={v.fbr[0]} y1={v.fbr[1]} x2={v.bbr[0]} y2={v.bbr[1]} stroke={edge} strokeWidth={v.thick * 0.7} />
            <line x1={v.btr[0]} y1={v.btr[1]} x2={v.btl[0]} y2={v.btl[1]} stroke={edge} strokeWidth={v.thick * 0.7} />
            <line x1={v.btr[0]} y1={v.btr[1]} x2={v.bbr[0]} y2={v.bbr[1]} stroke={edge} strokeWidth={v.thick * 0.5} />
          </g>
        ))}
      </g>

      {/* ===== WIREFRAME EDGES (crisp layer) ===== */}
      <g style={{ opacity: lo(p, 0.2), transition: 'opacity 1.5s' }}>
        {[lw, mv, rw].map((v, vi) => (
          <g key={`edge${vi}`}>
            {/* Front face */}
            <polygon points={pts(v.fbl, v.ftl, v.ftr, v.fbr)} fill="none" stroke={edge} strokeWidth={v.thick} />
            {/* Depth edges */}
            <line x1={v.ftr[0]} y1={v.ftr[1]} x2={v.btr[0]} y2={v.btr[1]} stroke={edge} strokeWidth={v.thick * 0.8} />
            <line x1={v.fbr[0]} y1={v.fbr[1]} x2={v.bbr[0]} y2={v.bbr[1]} stroke={edgeDim} strokeWidth={v.thick * 0.5} />
            {/* Top face */}
            <polygon points={pts(v.ftl, v.ftr, v.btr, v.btl)} fill="none" stroke={edge} strokeWidth={v.thick * 0.7} />
            {/* Back edge */}
            <line x1={v.btr[0]} y1={v.btr[1]} x2={v.bbr[0]} y2={v.bbr[1]} stroke={edgeDim} strokeWidth={v.thick * 0.4} />
          </g>
        ))}

        {/* Walkway columns */}
        <line x1="1258" y1="290" x2="1258" y2="520" stroke={edgeDim} strokeWidth={0.6} opacity={0.5} />
        <line x1="1270" y1="290" x2="1270" y2="520" stroke={edgeDim} strokeWidth={0.6} opacity={0.5} />
        <line x1="1250" y1="290" x2="1282" y2="290" stroke={edge} strokeWidth={0.8} />

        {/* Structural grid lines on front faces */}
        <line x1="1075" y1="360" x2="1250" y2="360" stroke={edgeDim} strokeWidth={0.5} opacity={0.3} />
        <line x1="1160" y1="215" x2="1160" y2="520" stroke={edgeDim} strokeWidth={0.3} opacity={0.15} />
        <line x1="1340" y1="300" x2="1340" y2="520" stroke={edgeDim} strokeWidth={0.3} opacity={0.15} />

        {/* Corner accent dots */}
        {[lw, mv, rw].flatMap(v => [v.ftl, v.ftr, v.btr, v.btl]).map((c, i) => (
          <circle key={`cd${i}`} cx={c[0]} cy={c[1]} r={2} fill={edge} opacity={0.6} />
        ))}
      </g>

      {/* ===== WINDOW FRAMES ===== */}
      <g style={{ opacity: lo(p, 0.38), transition: 'opacity 1.5s' }}>
        {/* Left wing — garage */}
        <rect x="952" y="408" width="105" height="98" fill="none" stroke={edge} strokeWidth={0.9} />
        <line x1="978" y1="408" x2="978" y2="506" stroke={edge} strokeWidth={0.4} />
        <line x1="1005" y1="408" x2="1005" y2="506" stroke={edge} strokeWidth={0.4} />
        <line x1="1031" y1="408" x2="1031" y2="506" stroke={edge} strokeWidth={0.4} />
        <line x1="952" y1="440" x2="1057" y2="440" stroke={edge} strokeWidth={0.35} />
        <line x1="952" y1="473" x2="1057" y2="473" stroke={edge} strokeWidth={0.35} />
        <rect x="1050" y="395" width="14" height="14" fill="none" stroke={edge} strokeWidth={0.5} />

        {/* Main — upper glass wall */}
        <rect x="1093" y="232" width="140" height="115" fill="none" stroke={edge} strokeWidth={1} />
        <line x1="1128" y1="232" x2="1128" y2="347" stroke={edge} strokeWidth={0.45} />
        <line x1="1163" y1="232" x2="1163" y2="347" stroke={edge} strokeWidth={0.45} />
        <line x1="1198" y1="232" x2="1198" y2="347" stroke={edge} strokeWidth={0.45} />
        <line x1="1093" y1="280" x2="1233" y2="280" stroke={edge} strokeWidth={0.35} />
        <line x1="1093" y1="315" x2="1233" y2="315" stroke={edge} strokeWidth={0.25} />

        {/* Main — lower glass */}
        <rect x="1093" y="378" width="98" height="125" fill="none" stroke={edge} strokeWidth={1} />
        <line x1="1142" y1="378" x2="1142" y2="503" stroke={edge} strokeWidth={0.45} />
        <line x1="1093" y1="440" x2="1191" y2="440" stroke={edge} strokeWidth={0.3} />
        <rect x="1202" y="378" width="36" height="125" fill="none" stroke={edge} strokeWidth={0.9} />

        {/* Main — entry */}
        <rect x="1208" y="453" width="28" height="67" fill="none" stroke={edge} strokeWidth={0.8} />
        <rect x="1208" y="440" width="28" height="13" fill="none" stroke={edge} strokeWidth={0.5} />

        {/* Right wing — tall paired windows */}
        <rect x="1300" y="318" width="32" height="182" fill="none" stroke={edge} strokeWidth={0.8} />
        <rect x="1348" y="318" width="32" height="182" fill="none" stroke={edge} strokeWidth={0.8} />
        <line x1="1300" y1="405" x2="1332" y2="405" stroke={edge} strokeWidth={0.3} />
        <line x1="1348" y1="405" x2="1380" y2="405" stroke={edge} strokeWidth={0.3} />
        <line x1="1300" y1="460" x2="1332" y2="460" stroke={edge} strokeWidth={0.3} />
        <line x1="1348" y1="460" x2="1380" y2="460" stroke={edge} strokeWidth={0.3} />
        <rect x="1300" y="304" width="80" height="11" fill="none" stroke={edge} strokeWidth={0.45} />

        {/* Side face windows (perspective, on right side of main volume) */}
        {(() => {
          const [sx1, sy1] = dp(1250, 250, 8);
          const [sx2, sy2] = dp(1250, 340, 8);
          const [sx3, sy3] = dp(1250, 250, 28);
          const [sx4, sy4] = dp(1250, 340, 28);
          return (
            <polygon points={pts([sx1,sy1],[sx3,sy3],[sx4,sy4],[sx2,sy2])}
              fill="none" stroke={edgeDim} strokeWidth={0.6} opacity={0.4} />
          );
        })()}
        {(() => {
          const [sx1, sy1] = dp(1250, 380, 8);
          const [sx2, sy2] = dp(1250, 500, 8);
          const [sx3, sy3] = dp(1250, 380, 28);
          const [sx4, sy4] = dp(1250, 500, 28);
          return (
            <polygon points={pts([sx1,sy1],[sx3,sy3],[sx4,sy4],[sx2,sy2])}
              fill="none" stroke={edgeDim} strokeWidth={0.5} opacity={0.3} />
          );
        })()}
      </g>

      {/* ===== WINDOW GLOW (volumetric interior light) ===== */}
      <g style={{ opacity: lo(p, 0.52), transition: 'opacity 2s' }}>
        {/* Deep volumetric bloom behind entire glass area */}
        <rect x="1075" y="220" width="175" height="295" fill="rgba(251,191,36,0.04)" filter="url(#wglowStr)" />

        {/* Garage */}
        <rect x="952" y="408" width="105" height="98" fill={glow} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 7s ease-in-out infinite' }} />
        <rect x="1050" y="395" width="14" height="14" fill={glowDeep} filter="url(#wglow)" />

        {/* Main upper */}
        <rect x="1093" y="232" width="140" height="115" fill={glow} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 8s ease-in-out infinite', animationDelay: '1s' }} />
        {/* Main lower */}
        <rect x="1093" y="378" width="98" height="125" fill={glow} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 6.5s ease-in-out infinite', animationDelay: '2s' }} />
        <rect x="1202" y="378" width="36" height="125" fill={glowDeep} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 7.5s ease-in-out infinite', animationDelay: '0.5s' }} />
        {/* Entry */}
        <rect x="1208" y="440" width="28" height="80" fill="rgba(251,191,36,0.2)" />

        {/* Right wing */}
        <rect x="1300" y="318" width="32" height="182" fill={glow} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 9s ease-in-out infinite', animationDelay: '3s' }} />
        <rect x="1348" y="318" width="32" height="182" fill={glow} filter="url(#wglow)"
          style={{ animation: 'heroWindowPulse 7s ease-in-out infinite', animationDelay: '1.5s' }} />
        <rect x="1300" y="304" width="80" height="11" fill={glowDeep} filter="url(#wglow)" />

        {/* Side face window glow (perspective) */}
        {(() => {
          const [sx1, sy1] = dp(1250, 250, 8);
          const [sx2, sy2] = dp(1250, 340, 8);
          const [sx3, sy3] = dp(1250, 250, 28);
          const [sx4, sy4] = dp(1250, 340, 28);
          return (
            <polygon points={pts([sx1,sy1],[sx3,sy3],[sx4,sy4],[sx2,sy2])}
              fill={glowDeep} filter="url(#wglow)" opacity={0.6}
              style={{ animation: 'heroWindowPulse 10s ease-in-out infinite', animationDelay: '2s' }} />
          );
        })()}
      </g>

      {/* ===== INTERIOR DEPTH / FINAL DETAIL ===== */}
      <g style={{ opacity: lo(p, 0.7), transition: 'opacity 2s' }}>
        {/* Interior ambient fill */}
        <rect x="1080" y="220" width="165" height="295" fill="rgba(251,191,36,0.015)" />
        <rect x="940" y="390" width="130" height="125" fill="rgba(251,191,36,0.01)" />
        <rect x="1288" y="305" width="105" height="210" fill="rgba(251,191,36,0.01)" />

        {/* Roof edge shadows */}
        {[lw, mv, rw].map((v, vi) => (
          <line key={`rs${vi}`} x1={v.ftl[0]} y1={v.ftl[1] + 3} x2={v.ftr[0]} y2={v.ftr[1] + 3}
            stroke="rgba(0,0,0,0.2)" strokeWidth={2.5} />
        ))}

        {/* Chimney */}
        <rect x="1228" y="178" width="12" height="37" fill="rgba(15,10,5,0.5)" stroke={edge} strokeWidth={0.8} opacity={0.5} />
        {(() => {
          const [bx, by] = dp(1240, 178, 8);
          return (
            <polygon points={pts([1240,178],[bx,by],[bx, by + 37],[1240,215])}
              fill="rgba(10,7,3,0.4)" stroke={edgeDim} strokeWidth={0.5} opacity={0.4} />
          );
        })()}

        {/* Steps */}
        <line x1="1195" y1="520" x2="1245" y2="520" stroke={edge} strokeWidth={0.8} opacity={0.35} />
        <line x1="1199" y1="526" x2="1241" y2="526" stroke={edgeDim} strokeWidth={0.6} opacity={0.25} />

        {/* Scan-line texture (holographic detail) */}
        {Array.from({ length: 8 }, (_, i) => {
          const y = MV.yt + 10 + i * 38;
          return y < MV.yb ? (
            <line key={`sc${i}`} x1={MV.x1 + 2} y1={y} x2={MV.x2 - 2} y2={y}
              stroke={edgeDim} strokeWidth={0.15} opacity={0.08}
              strokeDasharray="3 8" />
          ) : null;
        })}
      </g>
    </g>
  );
}
