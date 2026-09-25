import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Topbar, { type TopbarVariant } from "@/components/layout/Topbar";
import ToastRegion from "@/components/ui/ToastRegion";
import { BREADCRUMBS } from "@/components/layout/navConfig";

function routeFor(pathname: string): { rootClass: string; variant: TopbarVariant } {
  if (pathname.startsWith("/experimentos/")) {
    return { rootClass: "experiment-detail-root", variant: "experimentos" };
  }
  switch (pathname) {
    case "/funnel":
      return { rootClass: "funnel-root", variant: "funnel" };
    case "/canales":
      return { rootClass: "canales-root", variant: "canales" };
    case "/segmentos":
      return { rootClass: "segmentos-root", variant: "segmentos" };
    case "/campanas":
      return { rootClass: "campanas-root", variant: "campanas" };
    case "/oportunidades":
      return { rootClass: "oportunidades-root", variant: "oportunidades" };
    case "/experimentos":
      return { rootClass: "experimentos-root", variant: "experimentos" };
    default:
      return { rootClass: "resumen-root", variant: "resumen" };
  }
}

export default function AppShell() {
  const { pathname } = useLocation();
  const { rootClass, variant } = routeFor(pathname);
  const breadcrumb = pathname.startsWith("/experimentos/")
    ? "GrowthHub / Experimentos / Detalle del experimento"
    : (BREADCRUMBS[pathname] ?? BREADCRUMBS["/"]);
  const showGlobalSearch = pathname === "/" || pathname === "/funnel";

  return (
    <div className={rootClass}>
      <Topbar
        breadcrumb={breadcrumb}
        variant={variant}
        showGlobalSearch={showGlobalSearch}
      />
      <Sidebar />
      <ToastRegion />
      <Outlet />
    </div>
  );
}