import type { DemoState } from "@/demo/demoTypes";
import { createSeedState } from "@/demo/demoSeed";

export const STORAGE_KEY = "growthhub.demo.v1";

export function loadState(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createSeedState();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidState(parsed)) {
      return createSeedState();
    }
    return parsed as DemoState;
  } catch {
    return createSeedState();
  }
}

function isValidState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<DemoState>;
  if (candidate.version !== 1) {
    return false;
  }
  if (!candidate.filters || typeof candidate.filters !== "object") {
    return false;
  }
  return (
    Array.isArray(candidate.channels) &&
    Array.isArray(candidate.segments) &&
    Array.isArray(candidate.campaigns) &&
    Array.isArray(candidate.opportunities) &&
    Array.isArray(candidate.experiments) &&
    Array.isArray(candidate.activity)
  );
}

export function saveState(state: DemoState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // El almacenamiento puede no estar disponible (modo incógnito, cuota llena).
  }
}

export function resetStoredDemo(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}