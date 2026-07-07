import { money, pct } from "../utils/format";
import { viabilityMeta } from "../utils/viability";

export default function ProductQueue({
  products,
  results,
  selectedId,
  onSelect,
  onAdd,
  onRemove,
}) {
  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h2 className="font-display text-sm font-semibold text-ink">
            Cantidad de productos
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
            {products.length} en análisis
          </p>
        </div>
        <button
          onClick={onAdd}
          className="rounded-md bg-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide text-paper transition hover:bg-tape"
        >
          + Escanear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="p-5 text-sm text-ink-soft">
            No hay productos todavía. Agrega el primero que escaneaste en tienda.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {products.map((p) => {
              const r = results.find((res) => res.productId === p.id);
              const meta = viabilityMeta[r?.viability] || viabilityMeta.danger;
              const active = p.id === selectedId;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onSelect(p.id)}
                    className={`group flex w-full flex-col gap-1.5 px-4 py-3 text-left transition ${
                      active ? "bg-paper-dim" : "hover:bg-paper-dim/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-body text-sm font-medium leading-snug text-ink line-clamp-2">
                        {p.name || "Producto sin nombre"}
                      </span>
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-ink-faint">
                      <span>{p.asin || "sin ASIN"}</span>
                      <span className="tabular">×{p.quantity || 0}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs tabular">
                      <span className={r && r.netProfitUnit >= 0 ? "text-forest" : "text-tape"}>
                        {r ? money(r.netProfitUnit) : "$0.00"} / u
                      </span>
                      <span className="text-ink-soft">{r ? pct(r.roi, 0) : "0%"} ROI</span>
                    </div>
                  </button>
                  <div className="flex justify-end px-4 pb-2">
                    <button
                      onClick={() => onRemove(p.id)}
                      className="font-mono text-[10px] uppercase tracking-wide text-ink-faint transition hover:text-tape"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
