export interface SegmentosPresentationData {
  title: string;
  subtitleTemplate: string;
  sectionTitle: string;
  sectionSubtitle: string;
  distribution: {
    title: string;
    subtitleTemplate: string;
    insight: string;
  };
}

export const segmentosData: SegmentosPresentationData = {
  title: "Segmentos por intención",
  subtitleTemplate:
    "Clasifica a los {users} usuarios registrados de los {period} según su cercanía a la compra, leyendo señales de uso dentro del producto: informes creados, usuarios invitados, visitas a la página de precios y consultas al equipo comercial.",
  sectionTitle: "Los 5 segmentos, de menor a mayor intención",
  sectionSubtitle:
    "La tasa de conversión es propia de cada segmento: usuarios que pasaron a un plan de pago.",
  distribution: {
    title: "Distribución de la base",
    subtitleTemplate:
      "{users} usuarios · un solo segmento por usuario, recalculado cada noche",
    insight:
      "Casi 6 de cada 10 registrados siguen en intención baja (Explorador o Investigador): el volumen está lejos de la compra, y sólo el 9,1 % llega a intención alta.",
  },
};