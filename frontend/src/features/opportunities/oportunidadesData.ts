export interface OportunidadesPresentationData {
  title: string;
  subtitleTemplate: string;
  newButtonLabel: string;
}

export const oportunidadesData: OportunidadesPresentationData = {
  title: "Oportunidades detectadas",
  subtitleTemplate:
    "Generadas automáticamente a partir de las caídas del funnel y del rendimiento de los canales de los últimos {period} ({visits} visitas). Ordenadas por impacto estimado: primero la mayor pérdida de usuarios.",
  newButtonLabel: "Nueva oportunidad",
};