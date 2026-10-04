/* Bold generative compositions — one per project. viewBox 400x500. */

const C = {
  paper: "#f1efe8",
  carbon: "#0c0c0c",
  cobalt: "#2a44ff",
  lime: "#d6ff3f",
  tomato: "#ff5a36",
  blush: "#ffc2dc",
};

function Halo() {
  return (
    <>
      <rect width="400" height="500" fill={C.cobalt} />
      {[220, 175, 130, 85].map((r, i) => (
        <circle key={r} cx="200" cy="260" r={r} fill="none" stroke={C.lime} strokeWidth={i === 3 ? 0 : 3} />
      ))}
      <circle cx="200" cy="260" r="85" fill={C.lime} />
      <circle cx="238" cy="222" r="24" fill={C.cobalt} />
      <rect x="0" y="0" width="400" height="60" fill={C.carbon} />
      <text x="24" y="38" fontFamily="Inter Tight, sans-serif" fontWeight="700" fontSize="20" fill={C.lime}>
        halo®
      </text>
    </>
  );
}

function Field() {
  return (
    <>
      <rect width="400" height="500" fill={C.tomato} />
      <circle cx="200" cy="270" r="150" fill={C.paper} />
      <path d="M50 270a150 150 0 0 0 300 0z" fill={C.carbon} />
      <circle cx="200" cy="200" r="46" fill={C.tomato} />
      <rect x="120" y="40" width="160" height="14" rx="7" fill={C.carbon} />
      <rect x="150" y="66" width="100" height="14" rx="7" fill={C.carbon} />
      <circle cx="90" cy="430" r="16" fill={C.carbon} />
      <circle cx="310" cy="430" r="16" fill={C.paper} />
    </>
  );
}

function Tempo() {
  const paths = Array.from({ length: 9 }).map((_, i) => {
    const y = 70 + i * 48;
    const a = 20 + (i % 3) * 12;
    return `M -20 ${y} C 60 ${y - a}, 120 ${y + a}, 200 ${y} S 340 ${y - a}, 420 ${y}`;
  });
  return (
    <>
      <rect width="400" height="500" fill={C.carbon} />
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? C.lime : i % 3 === 1 ? C.blush : C.tomato} strokeWidth="14" strokeLinecap="round" />
      ))}
    </>
  );
}

function Nubra() {
  return (
    <>
      <rect width="400" height="500" fill={C.blush} />
      <g style={{ mixBlendMode: "multiply" }}>
        <circle cx="150" cy="200" r="130" fill={C.cobalt} />
        <circle cx="250" cy="260" r="120" fill={C.lime} />
        <circle cx="200" cy="340" r="110" fill={C.tomato} />
      </g>
      <circle cx="200" cy="250" r="8" fill={C.carbon} />
    </>
  );
}

function Lumen() {
  const cells: React.ReactNode[] = [];
  const cols = 4;
  const rows = 5;
  const s = 100;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = (r * 7 + c * 3) % 5;
      const x = c * s;
      const y = r * s;
      if (k === 0) cells.push(<rect key={`${r}${c}`} x={x} y={y} width={s} height={s} fill={C.carbon} />);
      else if (k === 1) cells.push(<path key={`${r}${c}`} d={`M${x} ${y + s}A${s} ${s} 0 0 1 ${x + s} ${y}V${y + s}z`} fill={C.carbon} />);
      else if (k === 2) cells.push(<circle key={`${r}${c}`} cx={x + s / 2} cy={y + s / 2} r={s / 2 - 8} fill={C.cobalt} />);
      else if (k === 3) cells.push(<path key={`${r}${c}`} d={`M${x} ${y}L${x + s} ${y + s}H${x}z`} fill={C.carbon} />);
    }
  }
  return (
    <>
      <rect width="400" height="500" fill={C.lime} />
      {cells}
    </>
  );
}

function Pulse() {
  return (
    <>
      <rect width="400" height="500" fill={C.cobalt} />
      <circle cx="200" cy="250" r="165" fill={C.carbon} />
      {[150, 138, 126, 114, 102, 90, 78].map((r) => (
        <circle key={r} cx="200" cy="250" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.12" />
      ))}
      <path d="M200 250 L 200 85 A165 165 0 0 1 340 160z" fill="#ffffff" fillOpacity="0.06" />
      <circle cx="200" cy="250" r="52" fill={C.tomato} />
      <circle cx="200" cy="250" r="7" fill={C.carbon} />
      <rect x="290" y="30" width="80" height="14" rx="7" fill={C.lime} transform="rotate(24 330 37)" />
    </>
  );
}

export default function Art({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 500" className="block h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {id === "halo" && <Halo />}
      {id === "field" && <Field />}
      {id === "tempo" && <Tempo />}
      {id === "nubra" && <Nubra />}
      {id === "lumen" && <Lumen />}
      {id === "pulse" && <Pulse />}
    </svg>
  );
}
