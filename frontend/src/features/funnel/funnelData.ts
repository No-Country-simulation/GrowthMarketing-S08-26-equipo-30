export interface FunnelPresentationData {
  title: string;
  subtitlePreface: string;
  subtitleSuffix: string;
  detail: {
    title: string;
    legend: {
      etapa: string;
      drop: string;
    };
  };
}

export const funnelData: FunnelPresentationData = {
  title: "Funnel de conversión",
  subtitlePreface: "Las cinco etapas del recorrido, ",
  subtitleSuffix:
    "Cada barra es el porcentaje sobre las visitas iniciales; entre etapas se muestra la caída y las personas perdidas.",
  detail: {
    title: "Etapas del recorrido",
    legend: {
      etapa: "Etapa",
      drop: "Caída al siguiente paso",
    },
  },
};