import { RouterProvider } from "react-router-dom";
import { DemoProvider } from "@/demo/DemoProvider";
import { router } from "@/app/router";

export default function App() {
  return (
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>
  );
}