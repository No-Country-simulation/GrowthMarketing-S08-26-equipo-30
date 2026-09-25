import type { DateRange } from "@/demo/demoTypes";
import { formatNumber } from "@/demo/demoFormat";

export const SCALE_BY_RANGE: Record<DateRange, number> = {
  last7: 0.24,
  last30: 1,
  last90: 2.85,
};

export const DATE_RANGE_LABELS: Record<
  DateRange,
  { label: string; range: string }
> = {
  last7: { label: "Últimos 7 días", range: "31 ago – 6 sep 2026" },
  last30: { label: "Últimos 30 días", range: "8 ago – 6 sep 2026" },
  last90: { label: "Últimos 90 días", range: "9 jun – 6 sep 2026" },
};

export interface TrendPoint {
  date: string;
  visits: number;
  visitsText: string;
  delta: number;
  y: number;
}

const TREND_SHAPE = [96, 92, 99, 88, 90, 82, 78, 84, 72, 66, 58, 48, 30, 8, 4];

const MONTHS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const TREND_START = new Date("2026-08-23T00:00:00Z");

function formatDay(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS_ES[date.getUTCMonth()]}`;
}

export function buildTrendSeries(visits: number): TrendPoint[] {
  const shapeSum = TREND_SHAPE.reduce((total, value) => total + value, 0);
  return TREND_SHAPE.map((y, index) => {
    const daily = Math.round((visits * y) / shapeSum);
    const previous =
      index > 0 ? Math.round((visits * TREND_SHAPE[index - 1]) / shapeSum) : null;
    const date = new Date(TREND_START);
    date.setUTCDate(TREND_START.getUTCDate() + index);
    return {
      date: formatDay(date),
      visits: daily,
      visitsText: formatNumber(daily),
      delta: previous ? (daily - previous) / previous : 0,
      y,
    };
  });
}