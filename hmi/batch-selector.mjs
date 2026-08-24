export const BATCH_MIN = 1;
export const BATCH_MAX = 250;

export function normalizeBatchTarget(value, fallback = BATCH_MIN) {
  const numeric = Number(value);
  const safeFallback = Number.isFinite(Number(fallback)) ? Number(fallback) : BATCH_MIN;
  const rounded = Number.isFinite(numeric) ? Math.round(numeric) : Math.round(safeFallback);
  return Math.max(BATCH_MIN, Math.min(BATCH_MAX, rounded));
}

export function batchValueFromScroll(scrollTop, rowHeight) {
  const safeRowHeight = Number(rowHeight);
  if (!Number.isFinite(safeRowHeight) || safeRowHeight <= 0) return BATCH_MIN;
  return normalizeBatchTarget(Math.round(Number(scrollTop || 0) / safeRowHeight) + BATCH_MIN);
}

export function batchRowHeightFromElement(element, fallback = 48) {
  const layoutHeight = Number(element?.offsetHeight);
  if (Number.isFinite(layoutHeight) && layoutHeight > 0) return layoutHeight;
  const safeFallback = Number(fallback);
  return Number.isFinite(safeFallback) && safeFallback > 0 ? safeFallback : 48;
}
