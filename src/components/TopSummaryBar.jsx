import { money, pct } from "../utils/format";

function StatBlock({ label, value, accent, sub }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:px-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
      <span
        className={`font-mono text-xl font-semibold tabular sm:text-2xl ${accent || "text-paper"}`}
      >
        {value}
      </span>
      {sub ? (
        <span className="font-mono text-[10px] text-ink-faint">{sub}</span>
      ) : null}
    </div>
  );
}

export default function TopSummaryBar({ summary, productCount }) {
  const { totals, avgRoi, counts } = summary;

  return (
    <div className="border-b border-ink/10 bg-ink text-paper">
      <div className="flex items-center justify-between gap-3 border-b border-paper/10 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-semibold tracking-tight">
            ScanProfit
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
            Total de caja · {productCount} producto{productCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-wide text-paper/60 sm:flex">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-forest" /> {counts.good} buenos
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate" /> {counts.medium} medio
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" /> {counts.low} ajustado
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-tape" /> {counts.danger} pierde
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-paper/10 sm:grid-cols-5">
        <StatBlock label="Unidades totales" value={totals.totalUnits} />
        <StatBlock label="Inversión total" value={money(totals.totalInvestment)} />
        <StatBlock label="Ingreso proyectado" value={money(totals.totalRevenue)} />
        <StatBlock
          label="Ganancia neta total"
          value={money(totals.totalProfit)}
          accent={totals.totalProfit >= 0 ? "text-forest" : "text-tape"}
        />
        <StatBlock
          label="ROI promedio ponderado"
          value={pct(avgRoi, 0)}
          accent={avgRoi >= 30 ? "text-forest" : avgRoi >= 0 ? "text-amber" : "text-tape"}
        />
      </div>
    </div>
  );
}
