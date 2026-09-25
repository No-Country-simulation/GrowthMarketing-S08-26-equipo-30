import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { DemoProvider } from "@/demo/DemoProvider";
import { appRoutes } from "@/app/router";

export function renderApp(initialPath = "/", options?: { clearStorage?: boolean }) {
  if (options?.clearStorage !== false) {
    window.localStorage.clear();
  }
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialPath],
  });
  const utils = render(
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>,
  );
  return { router, ...utils };
}