# ScanProfit — Validador de Arbitraje FBA

Herramienta profesional en **React + Vite + Tailwind CSS v4** para analizar
la rentabilidad de productos de arbitraje (retail o online) antes de
enviarlos a Amazon FBA. Pensada para escalar: cada pieza (config de fees,
cálculo, UI) está separada para que puedas seguir extendiéndola por partes.

## Cómo correrlo

```bash
npm install
npm run dev       # http://localhost:5173
```

Para generar el build de producción:

```bash
npm run build     # genera /dist
npm run preview   # sirve el build para probarlo
```

Los datos (productos y configuración de fees) se guardan automáticamente
en `localStorage` del navegador, así que no se pierden al recargar.

## Estructura del proyecto

```
src/
  data/
    defaultFeeConfig.js   # % de comisión por categoría, tarifas FBA por tamaño,
                           # parámetros globales (low-price, combustible, ROI objetivo)
    sampleProducts.js      # productos de ejemplo al primer arranque
  utils/
    calc.js                # motor de cálculo puro (sin React): computeProduct,
                           # computeGlobalSummary
    format.js              # money(), pct(), uid()
    viability.js            # mapeo de estado (bueno/medio/ajustado/no rentable)
                           # a colores y etiquetas, usado en toda la app
  hooks/
    useLocalStorage.js      # persistencia automática de estado
  components/
    TopSummaryBar.jsx       # "Total de caja": KPIs globales de todos los productos
    ProductQueue.jsx        # lista lateral de productos (cola de escaneo)
    ProductForm.jsx         # formulario de datos por producto (4 secciones)
    ReceiptBreakdown.jsx    # el "ticket" de desglose financiero por producto
    SettingsDrawer.jsx      # panel para editar % de categorías y tarifas FBA
    ViabilityBadge.jsx      # etiqueta de semáforo reutilizable
  App.jsx                   # conecta todo el estado y layout
```

## Cómo extenderlo (por partes, como pediste)

**Agregar una categoría o cambiar un %:**
No se toca código. Desde la UI, botón "⚙ Configurar fees" → "+ Categoría",
o edita el `rate` de una existente. Todo vive en `feeConfig.categories`.

**Agregar un nuevo costo (ej. costo de etiquetado, comisión de tarjeta, etc.):**
1. Agrega el campo al objeto `product` en `App.jsx` (función `blankProduct`)
   y a `sampleProducts.js`.
2. Agrega el input correspondiente en `ProductForm.jsx` (sección 3 o una nueva).
3. Súmalo en `computeProduct()` dentro de `utils/calc.js`, dentro de
   `unitInvestment` o `totalAmazonFees` según corresponda.
4. Automáticamente aparecerá en el ticket (`ReceiptBreakdown.jsx`) si agregas
   una fila `<Row />` ahí también.

**Agregar un nuevo tamaño/peso logístico FBA:**
Desde "Configurar fees" → "+ Tamaño", o edita `defaultFbaTiers` en
`src/data/defaultFeeConfig.js`.

**Cambiar las reglas de qué es "buen ROI":**
Editable desde el mismo panel de configuración (`roiTargetGood`,
`roiTargetMedium` en Parámetros Globales), o en el archivo de datos.

**Exportar/duplicar productos, importar CSV, multi-usuario, etc.:**
Son buenos siguientes pasos. Como el cálculo vive 100% en `utils/calc.js`
separado de la UI, se puede reutilizar igual para un botón "Exportar CSV"
o para conectar a una base de datos real más adelante.

## Notas de diseño

El tema visual es el de un **ticket de caja registradora / recibo de tienda**:
tipografía monoespaciada para las cifras (alineación perfecta de montos),
borde perforado, líneas punteadas y un código de barras generado por
producto — la idea es que se sienta como el recibo físico que sostienes
en la mano mientras escaneas un producto en la tienda.
