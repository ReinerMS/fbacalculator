import { uid } from "../utils/format";

function NumField({ value, onChange, step = "0.01", suffix }) {
  return (
    <div className="relative">
      <input
        type="number"
        step={step}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-line bg-white px-2 py-1.5 pr-7 font-mono text-xs tabular text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-ink-faint">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export default function SettingsDrawer({ open, onClose, feeConfig, onChange }) {
  if (!open) return null;

  const updateCategory = (id, patch) => {
    onChange({
      ...feeConfig,
      categories: feeConfig.categories.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    });
  };

  const updateCategoryLowPrice = (id, patch) => {
    onChange({
      ...feeConfig,
      categories: feeConfig.categories.map((c) =>
        c.id === id
          ? { ...c, lowPrice: c.lowPrice ? { ...c.lowPrice, ...patch } : { threshold: 10, rate: 0.08, ...patch } }
          : c
      ),
    });
  };

  const toggleLowPrice = (id) => {
    onChange({
      ...feeConfig,
      categories: feeConfig.categories.map((c) =>
        c.id === id
          ? { ...c, lowPrice: c.lowPrice ? null : { threshold: 10, rate: 0.08 } }
          : c
      ),
    });
  };

  const addCategory = () => {
    onChange({
      ...feeConfig,
      categories: [
        ...feeConfig.categories,
        { id: uid(), label: "Nueva categoría", rate: 0.15, lowPrice: null, minFee: 0.3 },
      ],
    });
  };

  const removeCategory = (id) => {
    if (feeConfig.categories.length <= 1) return;
    onChange({
      ...feeConfig,
      categories: feeConfig.categories.filter((c) => c.id !== id),
    });
  };

  const updateTier = (id, patch) => {
    onChange({
      ...feeConfig,
      fbaTiers: feeConfig.fbaTiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const addTier = () => {
    onChange({
      ...feeConfig,
      fbaTiers: [
        ...feeConfig.fbaTiers,
        { id: uid(), label: "Nuevo tamaño", baseCost: 4.0 },
      ],
    });
  };

  const removeTier = (id) => {
    if (feeConfig.fbaTiers.length <= 1) return;
    onChange({
      ...feeConfig,
      fbaTiers: feeConfig.fbaTiers.filter((t) => t.id !== id),
    });
  };

  const updateGlobal = (field) => (e) => {
    onChange({
      ...feeConfig,
      globals: { ...feeConfig.globals, [field]: Number(e.target.value) },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-[1px]">
      <div className="flex h-full w-full max-w-xl flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              Configuración de fees
            </h2>
            <p className="font-mono text-[11px] text-ink-faint">
              Estos valores alimentan todos los cálculos. Edítalos cuando Amazon
              cambie sus tarifas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 font-mono text-xs uppercase tracking-wide text-ink-soft hover:bg-paper-dim"
          >
            Cerrar ✕
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-5">
          {/* Categorías */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-ink">
                Comisión por referencia (categorías)
              </h3>
              <button
                onClick={addCategory}
                className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
              >
                + Categoría
              </button>
            </div>
            <div className="space-y-3">
              {feeConfig.categories.map((c) => (
                <div key={c.id} className="rounded-lg border border-line bg-white p-3">
                  <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-center gap-2">
                    <input
                      value={c.label}
                      onChange={(e) => updateCategory(c.id, { label: e.target.value })}
                      className="rounded-md border border-line bg-paper px-2 py-1.5 font-body text-sm text-ink outline-none focus:border-ink"
                    />
                    <div className="w-20">
                      <NumField
                        value={(c.rate * 100).toFixed(1)}
                        step="0.5"
                        suffix="%"
                        onChange={(e) => updateCategory(c.id, { rate: Number(e.target.value) / 100 })}
                      />
                    </div>
                    <button
                      onClick={() => removeCategory(c.id)}
                      className="font-mono text-[11px] text-ink-faint hover:text-tape"
                      title="Eliminar categoría"
                    >
                      ✕
                    </button>
                  </div>
                  <label className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
                    <input
                      type="checkbox"
                      checked={!!c.lowPrice}
                      onChange={() => toggleLowPrice(c.id)}
                      className="accent-ink"
                    />
                    Tasa reducida por precio bajo
                  </label>
                  {c.lowPrice && (
                    <div className="mt-2 grid grid-cols-2 gap-2 pl-5">
                      <div>
                        <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                          Umbral de precio ($)
                        </span>
                        <NumField
                          value={c.lowPrice.threshold}
                          onChange={(e) =>
                            updateCategoryLowPrice(c.id, { threshold: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                          Tasa reducida
                        </span>
                        <NumField
                          value={(c.lowPrice.rate * 100).toFixed(1)}
                          step="0.5"
                          suffix="%"
                          onChange={(e) =>
                            updateCategoryLowPrice(c.id, { rate: Number(e.target.value) / 100 })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tiers FBA */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-ink">
                Tarifas logísticas FBA (por tamaño)
              </h3>
              <button
                onClick={addTier}
                className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft hover:border-ink hover:text-ink"
              >
                + Tamaño
              </button>
            </div>
            <div className="space-y-2">
              {feeConfig.fbaTiers.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-[1fr_90px_auto] items-center gap-2 rounded-lg border border-line bg-white p-2.5"
                >
                  <input
                    value={t.label}
                    onChange={(e) => updateTier(t.id, { label: e.target.value })}
                    className="rounded-md border border-line bg-paper px-2 py-1.5 font-body text-sm text-ink outline-none focus:border-ink"
                  />
                  <NumField
                    value={t.baseCost}
                    suffix="$"
                    onChange={(e) => updateTier(t.id, { baseCost: Number(e.target.value) })}
                  />
                  <button
                    onClick={() => removeTier(t.id)}
                    className="font-mono text-[11px] text-ink-faint hover:text-tape"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Parámetros globales */}
          <section>
            <h3 className="mb-3 font-display text-sm font-semibold text-ink">
              Parámetros globales
            </h3>
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-3">
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  Umbral Low-Price FBA ($)
                </span>
                <NumField
                  value={feeConfig.globals.lowPriceThreshold}
                  onChange={updateGlobal("lowPriceThreshold")}
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  Descuento Low-Price FBA ($)
                </span>
                <NumField
                  value={feeConfig.globals.lowPriceDiscount}
                  onChange={updateGlobal("lowPriceDiscount")}
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  Piso mínimo tarifa logística ($)
                </span>
                <NumField
                  value={feeConfig.globals.lowPriceFloor}
                  onChange={updateGlobal("lowPriceFloor")}
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  Suplemento combustible (%)
                </span>
                <NumField
                  value={(feeConfig.globals.fuelSurchargeRate * 100).toFixed(1)}
                  step="0.1"
                  suffix="%"
                  onChange={(e) =>
                    onChange({
                      ...feeConfig,
                      globals: {
                        ...feeConfig.globals,
                        fuelSurchargeRate: Number(e.target.value) / 100,
                      },
                    })
                  }
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  ROI objetivo "bueno" (%)
                </span>
                <NumField
                  value={feeConfig.globals.roiTargetGood}
                  step="1"
                  onChange={updateGlobal("roiTargetGood")}
                />
              </div>
              <div>
                <span className="mb-1 block font-mono text-[10px] text-ink-faint">
                  ROI objetivo "medio" (%)
                </span>
                <NumField
                  value={feeConfig.globals.roiTargetMedium}
                  step="1"
                  onChange={updateGlobal("roiTargetMedium")}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
