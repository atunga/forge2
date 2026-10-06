import type { SVGProps } from "react";

export function ForgeMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M5 10h10l9 14h18M5 24h37M5 38h10l9-14" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <path d="m33 15 9 9-9 9" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
  </svg>;
}

export const machineTypes = {
  AUTOCRIB: ["RDS", "Robo500", "Robo1000", "Robo2000", "TX750", "VX500", "VX1000", "FX Locker", "FX Scale Locker", "HX60", "SD7", "Scalemate", "AutoCab FX", "VLM", "IntelliPort Lite"],
  CRIBMASTER: ["Toolbox", "ProStock", "ProLock", "MultiStore", "CabLock", "WeighStation", "AccuDrawer", "AccuCab", "AccuPort", "FlexSense"],
};

// Legacy Robo names remain supported because existing stations use those names.
export function MachineIcon({ type, brand, className, ...props }: SVGProps<SVGSVGElement> & { type: string; brand: string }) {
  const name = type.toLowerCase();
  const color = brand === "AUTOCRIB" ? "#ed443c" : brand === "CRIBMASTER" ? "#f4c928" : "#8fa582";
  const locker = /locker|lock|multistore/.test(name) && !/cablock/.test(name);
  const scale = /weigh|scale|flexsense/.test(name);
  const portal = /port/.test(name);
  const drawer = /drawer|sd7/.test(name);
  const cabinet = /cab|vlm/.test(name);
  const coils = /toolbox|hx60/.test(name);
  const rotary = /rds/.test(name);
  const compact = /500/.test(name) && !/750/.test(name);
  const rows = /2000/.test(name) ? 7 : /1000|prostock/.test(name) ? 6 : 4;
  return <svg viewBox="0 0 80 96" role="img" aria-label={`${brand === "AUTOCRIB" ? "AutoCrib" : brand === "CRIBMASTER" ? "CribMaster" : "Other"} ${type.split(" - ")[0]} machine`} className={className} {...props}>
    <title>{type.split(" - ")[0]}</title>
    {portal ? <><path d="M12 88V10h56v78H55V24H25v64Z" fill="#171816" stroke={color} strokeWidth="3" /><path d="M19 32h5m32 0h5M19 48h5m32 0h5M19 64h5m32 0h5" stroke={color} strokeWidth="3" /></> : <g transform={compact ? "translate(5 12) scale(.88)" : undefined}>
      <rect x={locker ? 4 : 12} y="7" width={locker ? 72 : 56} height="80" rx="4" fill={color} />
      <rect x={locker ? 8 : 16} y="17" width={locker ? 64 : 48} height="64" rx="2" fill="#171816" />
      <rect x="19" y="10" width="20" height="3" rx="1" fill="#171816" />
      {rotary && <ellipse cx="34" cy="46" rx="14" ry="24" fill={color} opacity=".3" />}
      {locker ? Array.from({length: name.includes('multi') ? 6 : 8},(_,i)=><g key={i}><rect x={10+(i%2)*31} y={21+Math.floor(i/2)*14} width="27" height="12" rx="1" fill={color} opacity=".85" /><path d={`M${32+(i%2)*31} ${26+Math.floor(i/2)*14}v3`} stroke="#171816" strokeWidth="2" /></g>) : scale ? Array.from({length:6},(_,i)=><g key={i}><path d={`M${20+(i%2)*22} ${27+Math.floor(i/2)*16}h17l-2 10h-13Z`} fill={color} opacity=".75"/><path d={`M${20+(i%2)*22} ${39+Math.floor(i/2)*16}h17`} stroke="#eae3cf" strokeWidth="1"/></g>) : cabinet ? <><rect x="20" y="22" width="28" height="51" rx="2" fill={color} opacity=".3"/><path d="M34 22v51M43 44v8" stroke={color} strokeWidth="2" />{name.includes('vlm') && <path d="M20 59h28v10H20Z" fill={color}/>}</> : drawer ? Array.from({length:7},(_,i)=><g key={i}><rect x="20" y={22+i*7} width="28" height="5" rx="1" fill={color} opacity=".7"/><path d={`M30 ${24+i*7}h8`} stroke="#171816"/></g>) : coils ? Array.from({length:12},(_,i)=><g key={i}><rect x={20+(i%3)*9} y={23+Math.floor(i/3)*11} width="7" height="9" fill={color} opacity=".2"/><path d={`M${21+(i%3)*9} ${28+Math.floor(i/3)*11}q2-5 4 0q-2 5-4 0`} stroke={color} strokeWidth="1.2"/></g>) : Array.from({length:rows},(_,i)=><g key={i}><rect x="20" y={22+i*(46/rows)} width="28" height={40/rows} rx="1" fill={color} opacity=".35"/><path d={`M29 ${22+i*(46/rows)}v${40/rows}m9 -${40/rows}v${40/rows}`} stroke={color} strokeWidth="1"/></g>)}
      {!locker && <><rect x="51" y="24" width="10" height="12" rx="1" fill="#c8d8bc"/><path d="M53 40h6m-6 4h6m-6 4h6" stroke={color} strokeWidth="1.5"/><rect x="22" y="73" width="24" height="5" rx="1" fill={color} opacity=".6"/></>}
      <path d="M17 87v4m46-4v4" stroke="#171816" strokeWidth="5" />
    </g>}
  </svg>;
}

export function BrandBadge({ brand }: { brand: string }) {
  return <span className={`brand-badge ${brand === "AUTOCRIB" ? "brand-ac" : brand === "CRIBMASTER" ? "brand-cm" : ""}`}><span />{brand === "AUTOCRIB" ? "AutoCrib" : brand === "CRIBMASTER" ? "CribMaster" : brand}</span>;
}
