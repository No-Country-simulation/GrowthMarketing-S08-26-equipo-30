import { describe, it, expect, beforeEach } from "vitest";
import {
  loadState,
  resetStoredDemo,
  saveState,
  STORAGE_KEY,
} from "@/demo/demoStorage";
import { createSeedState } from "@/demo/demoSeed";

describe("demoStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("devuelve el seed cuando no hay estado guardado", () => {
    const state = loadState();
    expect(state.version).toBe(1);
    expect(state.channels).toHaveLength(8);
    expect(state.campaigns).toHaveLength(3);
  });

  it("persiste y restaura el estado de dominio y filtros", () => {
    const state = createSeedState();
    state.filters.search = "meta";
    state.filters.dateRange = "last7";
    state.campaigns[0].status = "pausado";
    saveState(state);
    const loaded = loadState();
    expect(loaded.filters.search).toBe("meta");
    expect(loaded.filters.dateRange).toBe("last7");
    expect(loaded.campaigns[0].status).toBe("pausado");
  });

  it("recupera el seed si el JSON es inválido", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");
    const state = loadState();
    expect(state.version).toBe(1);
    expect(state.channels).toHaveLength(8);
  });

  it("valida la version antes de hidratar", () => {
    const state = createSeedState();
    const invalid = { ...state, version: 99 };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invalid));
    const loaded = loadState();
    expect(loaded.version).toBe(1);
    expect(loaded.channels).toHaveLength(8);
  });

  it("resetStoredDemo borra la clave", () => {
    const state = createSeedState();
    saveState(state);
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    resetStoredDemo();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadState().channels).toHaveLength(8);
  });
});