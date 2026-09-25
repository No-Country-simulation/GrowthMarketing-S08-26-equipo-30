import type { KeyboardEvent } from "react";

export function onEnterOrSpace(
  event: KeyboardEvent,
  action: () => void,
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}