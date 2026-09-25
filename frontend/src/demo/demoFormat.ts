export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    useGrouping: "always" as unknown as boolean,
  }).format(Math.round(value));
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) {
    return "0,0 %";
  }
  const formatted = (value * 100).toFixed(decimals).replace(".", ",");
  return `${formatted} %`;
}

export function formatPercentDelta(value: number): string {
  const formatted = (value * 100).toFixed(1).replace(".", ",");
  return `${formatted} %`;
}

export function clampToRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}