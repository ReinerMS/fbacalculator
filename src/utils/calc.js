// Motor de cálculo puro: recibe un producto + la configuración de fees
// y devuelve el desglose financiero completo. No toca el DOM ni React,
// así se puede testear o reutilizar en otro contexto sin fricción.

export function getCategory(feeConfig, categoryId) {
  return (
    feeConfig.categories.find((c) => c.id === categoryId) ||
    feeConfig.categories[feeConfig.categories.length - 1]
  );
}

export function getFbaTier(feeConfig, tierId) {
  return (
    feeConfig.fbaTiers.find((t) => t.id === tierId) || feeConfig.fbaTiers[0]
  );
}

/**
 * Calcula el desglose de un producto individual (por unidad y totales por lote).
 */
export function computeProduct(product, feeConfig) {
  const salePrice = Number(product.salePrice) || 0;
  const unitCost = Number(product.unitCost) || 0;
  const prepCost = Number(product.prepCost) || 0;
  const shippingCost = Number(product.shippingCost) || 0;
  const storageCost = Number(product.storageCost) || 0;
  const quantity = Math.max(0, Number(product.quantity) || 0);

  const category = getCategory(feeConfig, product.categoryId);
  const tier = getFbaTier(feeConfig, product.fbaTierId);
  const { globals } = feeConfig;

  // Tu inversión por unidad (lo que arriesgas al comprar + preparar + enviar)
  const unitInvestment = unitCost + prepCost + shippingCost;

  // Comisión por referencia: usa la tasa reducida si aplica low-price de categoría
  let refRate = category.rate;
  let categoryLowPriceActive = false;
  if (category.lowPrice && salePrice <= category.lowPrice.threshold) {
    refRate = category.lowPrice.rate;
    categoryLowPriceActive = true;
  }
  const referralFee = Math.max(category.minFee, salePrice * refRate);

  // Descuento logístico "Low-Price FBA" (a nivel de precio de venta global)
  let fbaBase = tier.baseCost;
  let lowPriceFbaActive = false;
  if (salePrice > 0 && salePrice <= globals.lowPriceThreshold) {
    fbaBase = Math.max(globals.lowPriceFloor, fbaBase - globals.lowPriceDiscount);
    lowPriceFbaActive = true;
  }

  const fuelSurcharge = fbaBase * globals.fuelSurchargeRate;
  const totalAmazonFees = referralFee + fbaBase + fuelSurcharge + storageCost;

  const netProfitUnit = salePrice - unitInvestment - totalAmazonFees;
  const roi = unitInvestment > 0 ? (netProfitUnit / unitInvestment) * 100 : 0;
  const marginPct = salePrice > 0 ? (netProfitUnit / salePrice) * 100 : 0;

  const totalInvestment = unitInvestment * quantity;
  const totalRevenue = salePrice * quantity;
  const totalFees = totalAmazonFees * quantity;
  const totalProfit = netProfitUnit * quantity;

  let viability = "danger";
  if (netProfitUnit > 0 && roi >= globals.roiTargetGood) viability = "good";
  else if (netProfitUnit > 0 && roi >= globals.roiTargetMedium) viability = "medium";
  else if (netProfitUnit > 0) viability = "low";

  return {
    productId: product.id,
    categoryLabel: category.label,
    tierLabel: tier.label,
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
  };
}

/**
 * Agrega los resultados de todos los productos en un resumen global
 * (para el panel de "Total de Caja").
 */
export function computeGlobalSummary(products, feeConfig) {
  const results = products.map((p) => computeProduct(p, feeConfig));

  const totals = results.reduce(
    (acc, r) => {
      acc.totalInvestment += r.totalInvestment;
      acc.totalRevenue += r.totalRevenue;
      acc.totalFees += r.totalFees;
      acc.totalProfit += r.totalProfit;
      acc.totalUnits += r.quantity;
      return acc;
    },
    { totalInvestment: 0, totalRevenue: 0, totalFees: 0, totalProfit: 0, totalUnits: 0 }
  );

  const avgRoi =
    totals.totalInvestment > 0
      ? (totals.totalProfit / totals.totalInvestment) * 100
      : 0;

  const counts = results.reduce(
    (acc, r) => {
      acc[r.viability] = (acc[r.viability] || 0) + 1;
      return acc;
    },
    { good: 0, medium: 0, low: 0, danger: 0 }
  );

  return { results, totals, avgRoi, counts };
}
