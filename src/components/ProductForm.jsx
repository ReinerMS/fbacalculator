function Field({ label, help, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {help ? <span className="text-[11px] text-ink-faint">{help}</span> : null}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-line bg-white px-3 py-2 font-mono text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
    />
  );
}

function MoneyInput({ value, onChange, ...rest }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-ink-faint">
        $
      </span>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={onChange}
        {...rest}
        className="w-full rounded-md border border-line bg-white py-2 pl-6 pr-3 font-mono text-sm tabular text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-line bg-white px-3 py-2 font-mono text-sm text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
    >
      {children}
    </select>
  );
}

function SectionTitle({ n, children }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-line pb-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[10px] font-semibold text-paper">
        {n}
      </span>
      <h3 className="font-display text-[13px] font-semibold uppercase tracking-wide text-ink">
        {children}
      </h3>
    </div>
  );
}

export default function ProductForm({ product, feeConfig, onChange }) {
  if (!product) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-center text-sm text-ink-faint">
        Selecciona o agrega un producto para ver su formulario de análisis.
      </div>
    );
  }

  const set = (field) => (e) => {
    const val = e.target.value;
    onChange({ ...product, [field]: field === "name" || field === "asin" || field === "categoryId" || field === "fbaTierId" ? val : val });
  };

  const setNumber = (field) => (e) => {
    onChange({ ...product, [field]: e.target.value });
  };

  return (
    <div className="space-y-6 p-5">
      <div>
        <SectionTitle n="1">Identificación del producto</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre del producto">
            <TextInput
              type="text"
              value={product.name}
              onChange={set("name")}
              placeholder="Ej. Labial hidratante mate"
            />
          </Field>
          <Field label="ASIN (opcional)" help="Para cruzar con Keepa / SAS">
            <TextInput
              type="text"
              value={product.asin}
              onChange={set("asin")}
              placeholder="B0XXXXXXXX"
            />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle n="2">Datos de mercado (Amazon)</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Precio de venta (Buy Box)" help="Precio actual en Amazon">
            <MoneyInput value={product.salePrice} onChange={setNumber("salePrice")} />
          </Field>
          <Field label="Categoría" help="Define el % de comisión de referencia">
            <Select value={product.categoryId} onChange={set("categoryId")}>
              {feeConfig.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({(c.rate * 100).toFixed(0)}%
                  {c.lowPrice ? ` / ${(c.lowPrice.rate * 100).toFixed(0)}% low-price` : ""})
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle n="3">Costos de adquisición por unidad</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Costo de compra" help="Lo que pagas en tienda o proveedor">
            <MoneyInput value={product.unitCost} onChange={setNumber("unitCost")} />
          </Field>
          <Field label="Prep center / unidad">
            <MoneyInput value={product.prepCost} onChange={setNumber("prepCost")} />
          </Field>
          <Field label="Envío a FBA / unidad">
            <MoneyInput value={product.shippingCost} onChange={setNumber("shippingCost")} />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle n="4">Logística Amazon y cantidad del lote</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Tamaño / peso logístico">
            <Select value={product.fbaTierId} onChange={set("fbaTierId")}>
              {feeConfig.fbaTiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} — ${t.baseCost.toFixed(2)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Almacenaje estimado / unidad">
            <MoneyInput value={product.storageCost} onChange={setNumber("storageCost")} />
          </Field>
          <Field label="Cantidad a comprar" help="Unidades de este lote">
            <TextInput
              type="number"
              min="0"
              step="1"
              value={product.quantity}
              onChange={setNumber("quantity")}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
