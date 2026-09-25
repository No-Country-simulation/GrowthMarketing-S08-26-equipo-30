import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import AppShell from "@/app/AppShell";
import ResumenPage from "@/features/dashboard/ResumenPage";
import FunnelPage from "@/features/funnel/FunnelPage";
import CanalesPage from "@/features/channels/CanalesPage";
import SegmentosPage from "@/features/segments/SegmentosPage";
import CampanasPage from "@/features/campaigns/CampanasPage";
import OportunidadesPage from "@/features/opportunities/OportunidadesPage";
import ExperimentosPage from "@/features/experiments/ExperimentosPage";
import ExperimentDetailPage from "@/features/experiments/ExperimentDetailPage";

export const appRoutes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <ResumenPage /> },
      { path: "/funnel", element: <FunnelPage /> },
      { path: "/canales", element: <CanalesPage /> },
      { path: "/segmentos", element: <SegmentosPage /> },
      { path: "/campanas", element: <CampanasPage /> },
      { path: "/oportunidades", element: <OportunidadesPage /> },
      { path: "/experimentos", element: <ExperimentosPage /> },
      { path: "/experimentos/:id", element: <ExperimentDetailPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);