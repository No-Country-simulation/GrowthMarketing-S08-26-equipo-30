export type AppView =
  | "resumen"
  | "funnel"
  | "canales"
  | "segmentos"
  | "campanas"
  | "oportunidades"
  | "experimentos"
  | "experimentoDetalle";

export interface NavItem {
  id:
    | "resumen"
    | "funnel"
    | "canales"
    | "segmentos"
    | "campanas"
    | "experimentos"
    | "oportunidades";
  label: string;
  iconSrc: string;
  active: boolean;
  targetView?: AppView;
}