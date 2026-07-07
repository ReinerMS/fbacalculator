import { viabilityMeta } from "../utils/viability";

export default function ViabilityBadge({ viability, size = "sm" }) {
  const meta = viabilityMeta[viability] || viabilityMeta.danger;
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase tracking-wide ${meta.bg} ${meta.text} ${padding}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
