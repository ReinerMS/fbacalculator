export function money(n) {
  const v = Number.isFinite(n) ? n : 0;
  const sign = v < 0 ? "-" : "";
  return `${sign}$${Math.abs(v).toFixed(2)}`;
}

export function pct(n, digits = 1) {
  const v = Number.isFinite(n) ? n : 0;
  return `${v.toFixed(digits)}%`;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
