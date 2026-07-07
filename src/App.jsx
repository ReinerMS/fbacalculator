import { useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { defaultFeeConfig } from "./data/defaultFeeConfig";
import { sampleProducts } from "./data/sampleProducts";
import { computeGlobalSummary } from "./utils/calc";
import { uid } from "./utils/format";

import TopSummaryBar from "./components/TopSummaryBar";
import ProductQueue from "./components/ProductQueue";
import ProductForm from "./components/ProductForm";
import ReceiptBreakdown from "./components/ReceiptBreakdown";
import SettingsDrawer from "./components/SettingsDrawer";

function blankProduct() {
  return {
    id: uid(),
    name: "",
    asin: "",
    categoryId: "standard",
    salePrice: "",
    unitCost: "",
    prepCost: "",
    shippingCost: "",
    fbaTierId: "small_light",
    storageCost: "",
    quantity: 1,
  };
}

export default function App() {
  const [feeConfig, setFeeConfig] = useLocalStorage(
    "scanprofit_fee_config",
    defaultFeeConfig
  );
  const [products, setProducts] = useLocalStorage(
    "scanprofit_products",
    sampleProducts
  );
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const summary = useMemo(
    () => computeGlobalSummary(products, feeConfig),
    [products, feeConfig]
  );

  const selectedProduct = products.find((p) => p.id === selectedId) || null;
  const selectedResult = summary.results.find((r) => r.productId === selectedId) || null;

  const handleAdd = () => {
    const p = blankProduct();
    setProducts([p, ...products]);
    setSelectedId(p.id);
  };

  const handleRemove = (id) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }
  };

  const handleChangeProduct = (updated) => {
    setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
  };

  const generatedAt = new Date().toLocaleString("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex h-screen flex-col bg-paper-dim">
      <TopSummaryBar summary={summary} productCount={products.length} />

      <div className="flex min-h-0 flex-1">
        {/* Cola de productos */}
        <aside className="w-full max-w-[300px] shrink-0 border-r border-line">
          <ProductQueue
            products={products}
            results={summary.results}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </aside>

        {/* Formulario */}
        <main className="min-w-0 flex-1 overflow-y-auto border-r border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h1 className="font-display text-sm font-semibold text-ink">
              Análisis de producto
            </h1>
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft transition hover:border-ink hover:text-ink"
            >
              ⚙ Configurar fees
            </button>
          </div>
          <ProductForm
            product={selectedProduct}
            feeConfig={feeConfig}
            onChange={handleChangeProduct}
          />
        </main>

        {/* Ticket de resultado */}
        <section className="hidden w-full max-w-sm shrink-0 overflow-y-auto bg-paper-dim px-4 py-6 paper-texture lg:block">
          {selectedProduct ? (
            <ReceiptBreakdown
              product={selectedProduct}
              result={selectedResult}
              generatedAt={generatedAt}
            />
          ) : (
            <p className="mt-10 text-center text-sm text-ink-faint">
              El ticket de análisis aparecerá aquí.
            </p>
          )}
        </section>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        feeConfig={feeConfig}
        onChange={setFeeConfig}
      />
    </div>
  );
}
