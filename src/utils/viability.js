// Mapea el estado de viabilidad del cálculo a texto y clases visuales.
// Centralizado acá para que el semáforo se vea igual en la lista,
// el resumen global y el ticket de detalle.

export const viabilityMeta = {
  good: {
    label: "Buen arbitraje",
    dot: "bg-forest",
    text: "text-forest",
    bg: "bg-forest-soft",
    ring: "ring-forest/30",
  },
  medium: {
    label: "Riesgo medio",
    dot: "bg-slate",
    text: "text-slate",
    bg: "bg-slate-soft",
    ring: "ring-slate/30",
  },
  low: {
    label: "Margen ajustado",
    dot: "bg-amber",
    text: "text-amber",
    bg: "bg-amber-soft",
    ring: "ring-amber/30",
  },
  danger: {
    label: "No rentable",
    dot: "bg-tape",
    text: "text-tape",
    bg: "bg-tape-soft",
    ring: "ring-tape/30",
  },
};
