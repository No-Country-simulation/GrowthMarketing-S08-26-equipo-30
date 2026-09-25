export interface CanalesPresentationData {
  title: string;
  subtitle: string;
  conversionSection: {
    title: string;
    legend: { high: string; medium: string; low: string };
    subtitle: string;
    columns: { conversion: string; visits: string; retention: string };
    footer: string;
  };
  comparisonSection: {
    title: string;
    subtitle: string;
    columns: string[];
  };
}

export const canalesData: CanalesPresentationData = {
  title: "Canales de adquisición",
  subtitle:
    "Ocho canales activos en los últimos 30 días, ordenados por conversión a registro. El color de cada barra indica la calidad del canal, medida por su retención a 90 días.",
  conversionSection: {
    title: "Conversión a registro por canal",
    legend: {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    },
    subtitle:
      "Ordenado de mayor a menor conversión · el color indica la calidad del canal",
    columns: {
      conversion: "Conversión a registro",
      visits: "Visitas",
      retention: "Ret. 90 d",
    },
    footer:
      "La línea violeta marca el objetivo del 7 % de conversión. Meta prospecting y LinkedIn Ads quedan por debajo aportando el mayor volumen de visitas; referidos y newsletter convierten el doble y retienen el triple con una fracción del tráfico.",
  },
  comparisonSection: {
    title: "Comparativa de canales",
    subtitle: "Ordenado por retención a 90 días",
    columns: ["canal", "Visitas", "Registros", "Conversión", "Ret. 90 d", "calidad"],
  },
};