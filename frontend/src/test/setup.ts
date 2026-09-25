import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  if (typeof window.crypto.randomUUID !== "function") {
    Object.defineProperty(window.crypto, "randomUUID", {
      value: () =>
        `test-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`,
    });
  }
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }
});