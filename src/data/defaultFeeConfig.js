// Configuración base de comisiones de Amazon FBA.
// Esta es la "fuente de la verdad" del cálculo: todo % y monto vive acá,
// nunca hardcodeado dentro de los componentes. El usuario puede editar
// estos valores desde el panel de Configuración sin tocar código.

// --- Comisión por referencia (Referral Fee), por categoría ---
// `rate` es el % estándar. `lowPrice` (opcional) permite una tasa reducida
// cuando el precio de venta es igual o menor al `threshold` (típico en Belleza).
export const defaultCategories = [
  {
    id: "beauty",
    label: "Belleza / Maquillaje",
    rate: 0.15,
    lowPrice: { threshold: 10.0, rate: 0.08 },
    minFee: 0.3,
  },
  {
    id: "pets",
    label: "Mascotas",
    rate: 0.15,
    lowPrice: null,
    minFee: 0.3,
  },
  {
    id: "home",
    label: "Hogar y Cocina",
    rate: 0.15,
    lowPrice: null,
    minFee: 0.3,
  },
  {
    id: "toys",
    label: "Juguetes y Juegos",
    rate: 0.15,
    lowPrice: null,
    minFee: 0.3,
  },
  {
    id: "grocery",
    label: "Alimentos y Bebidas",
    rate: 0.08,
    lowPrice: null,
    minFee: 0.3,
  },
  {
    id: "electronics_acc",
    label: "Accesorios de Electrónica",
    rate: 0.15,
    lowPrice: null,
    minFee: 0.3,
  },
  {
    id: "standard",
    label: "Otras categorías estándar",
    rate: 0.15,
    lowPrice: null,
    minFee: 0.3,
  },
];

// --- Tarifas logísticas FBA por tamaño/peso (Fulfillment Fee) ---
// `lowPriceDiscount`: el descuento "Low-Price FBA" que Amazon aplica cuando
// el precio de venta es <= lowPriceThreshold global (ver abajo).
export const defaultFbaTiers = [
  { id: "small_light", label: "Pequeño Ligero (≤ 16 oz)", baseCost: 3.15 },
  { id: "large_std_1", label: "Grande Estándar (≤ 1 lb)", baseCost: 4.05 },
  { id: "large_std_2", label: "Grande Estándar (1–2 lb)", baseCost: 4.55 },
  { id: "large_std_3", label: "Grande Estándar (2–3 lb)", baseCost: 5.25 },
  { id: "large_bulky", label: "Voluminoso (≤ 50 lb)", baseCost: 9.5 },
];

// --- Parámetros globales del modelo ---
export const defaultGlobalSettings = {
  // Descuento automático de "Low-Price FBA" cuando el precio de venta
  // es igual o menor a este monto.
  lowPriceThreshold: 10.0,
  lowPriceDiscount: 0.86,
  lowPriceFloor: 1.5, // el fee logístico nunca baja de este piso
  // Suplemento de combustible aplicado sobre el fee logístico base.
  fuelSurchargeRate: 0.035,
  // ROI mínimo aceptable para considerar "buen producto" (usado en semáforo).
  roiTargetGood: 30,
  roiTargetMedium: 15,
};

export const defaultFeeConfig = {
  categories: defaultCategories,
  fbaTiers: defaultFbaTiers,
  globals: defaultGlobalSettings,
};
