export interface ResumenPresentationData {
  title: string;
  subtitleSuffix: string;
  visitTrend: {
    title: string;
    subtitle: string;
    labels: [string, string, string];
    delta: string;
    caption: string;
  };
  funnelSection: {
    title: string;
    caption: string;
    buttonLabel: string;
  };
  channelQualitySection: {
    title: string;
    subtitleTemplate: string;
    footer: string;
  };
}

export const resumenData: ResumenPresentationData = {
  title: "Resumen de crecimiento",
  subtitleSuffix:
    "· adquisición, activación y conversión, comparado con los 30 días anteriores.",
  visitTrend: {
    title: "Tendencia de visitas",
    subtitle: "Últimos 14 días · media 12,9 K/día",
    labels: ["24 ago", "31 ago", "6 sep"],
    delta: "+18,4 %",
    caption: "últimos 7 días vs. 7 anteriores",
  },
  funnelSection: {
    title: "Recorrido del usuario",
    caption: "De la visita a la retención · 5 etapas",
    buttonLabel: "Ver Funnel completo",
  },
  channelQualitySection: {
    title: "Registros por calidad de canal",
    subtitleTemplate: "{registrations} registros · calidad medida por retención a 90 d",
    footer:
      "Más de la mitad de los registros llega por canales de calidad media o baja: volumen que no se convierte en retención.",
  },
};