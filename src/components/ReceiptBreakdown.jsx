import { money, pct } from "../utils/format";
import ViabilityBadge from "./ViabilityBadge";

function Row({ label, value, muted, strong, indent }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-1 font-mono text-[12.5px] ${
        strong ? "font-semibold text-ink" : muted ? "text-ink-faint" : "text-ink-soft"
      } ${indent ? "pl-3" : ""}`}
    >
      <span className="truncate">{label}</span>
      <span className="tabular whitespace-nowrap">{value}</span>
    </div>
  );
}

// Genera un patrón de barras pseudo-aleatorio pero determinístico a partir
// del ASIN/nombre, para que cada ticket tenga "su" código de barras propio.
function Barcode({ seed }) {
  const str = String(seed || "SCANPROFIT");
  const bars = Array.from({ length: 36 }, (_, i) => {
    const code = str.charCodeAt(i % str.length) + i * 7;
    return (code % 3) + 1;
  });
  return (
    <div className="flex h-8 items-end gap-[1.5px]" aria-hidden="true">
      {bars.map((w, i) => (
        <span
          key={i}
          style={{ width: `${w}px`, height: i % 5 === 0 ? "100%" : "70%" }}
          className="bg-ink"
        />
      ))}
    </div>
  );
}

export default function ReceiptBreakdown({ product, result, generatedAt }) {
  if (!product || !result) {
    return null;
  }

  const {
    categoryLabel,
    tierLabel,
    unitInvestment,
    referralFee,
    refRate,
    fbaBase,
    fuelSurcharge,
    storageCost,
    totalAmazonFees,
    netProfitUnit,
    roi,
    marginPct,
    quantity,
    totalInvestment,
    totalRevenue,
    totalFees,
    totalProfit,
    categoryLowPriceActive,
    lowPriceFbaActive,
    viability,
  } = result;

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="ticket-perforation relative rounded-sm bg-white pt-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="px-5 pb-4">
          {/* Encabezado del ticket */}
          <div className="mb-3 text-center">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">
              Ticket de análisis
            </p>
            <p className="font-mono text-[10px] text-ink-faint">{generatedAt}</p>
          </div>

          <div className="dashed-rule mb-2 pb-2 text-center">
            <p className="font-body text-sm font-semibold leading-snug text-ink">
              {product.name || "Producto sin nombre"}
            </p>
            <p className="font-mono text-[11px] text-ink-faint">
              {product.asin || "SIN-ASIN"} · {categoryLabel}
            </p>
          </div>

          {/* Por unidad */}
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Por unidad
          </p>
          <Row label="Precio de venta" value={money(product.salePrice)} />
          <Row label="Inversión (compra+prep+envío)" value={money(unitInvestment)} muted />
          <Row
            label={`Comisión referencia (${(refRate * 100).toFixed(0)}%)`}
            value={money(referralFee)}
            muted
            indent
          />
          <Row label={`Logística FBA — ${tierLabel}`} value={money(fbaBase)} muted indent />
          <Row label="Suplemento combustible" value={money(fuelSurcharge)} muted indent />
          <Row label="Almacenaje" value={money(storageCost)} muted indent />
          <Row label="Total fees Amazon" value={money(totalAmazonFees)} />

          <div className="dashed-rule my-2" />

          <Row
            label="Ganancia neta / unidad"
            value={money(netProfitUnit)}
            strong
          />
          <Row label="ROI" value={pct(roi, 1)} strong />
          <Row label="Margen sobre venta" value={pct(marginPct, 1)} muted />

          <div className="dashed-rule my-2" />

          {/* Total del lote */}
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Total del lote · ×{quantity} unidades
          </p>
          <Row label="Inversión total" value={money(totalInvestment)} muted />
          <Row label="Ingreso total" value={money(totalRevenue)} muted />
          <Row label="Fees totales" value={money(totalFees)} muted />
          <Row label="Ganancia total del lote" value={money(totalProfit)} strong />

          {(categoryLowPriceActive || lowPriceFbaActive) && (
            <div className="mt-3 space-y-1.5">
              {categoryLowPriceActive && (
                <p className="rounded bg-slate-soft px-2 py-1 font-mono text-[10.5px] text-slate">
                  Comisión reducida por precio ≤ umbral de categoría.
                </p>
              )}
              {lowPriceFbaActive && (
                <p className="rounded bg-forest-soft px-2 py-1 font-mono text-[10.5px] text-forest">
                  Descuento Low-Price FBA aplicado a la tarifa logística.
                </p>
              )}
            </div>
          )}

          <div className="dashed-rule my-3" />

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
              Veredicto
            </span>
            <ViabilityBadge viability={viability} size="md" />
          </div>

          <div className="mt-4 flex justify-center">
            <Barcode seed={product.asin || product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
