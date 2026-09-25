import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import grid01Accent from "@/assets/icons/figma/grid-01-accent.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import funnelAccent from "@/assets/icons/figma/funnel-accent.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import broadcastAccent from "@/assets/icons/figma/broadcast-accent.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import peopleAccent from "@/assets/icons/figma/people-accent.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import graphUpArrowAccent from "@/assets/icons/figma/graph-up-arrow-accent.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import lightbulbAccent from "@/assets/icons/figma/lightbulb-accent.svg";

export interface NavItemConfig {
  to: string;
  label: string;
  iconSrc: string;
  iconActiveSrc: string;
  match: string;
}

export const DEMO_USER = {
  initials: "MC",
  name: "Marina Costa",
  role: "Growth · Marketing",
};

export const DEMO_NAV: NavItemConfig[] = [
  {
    to: "/",
    label: "Resumen",
    iconSrc: grid01Body,
    iconActiveSrc: grid01Accent,
    match: "/",
  },
  {
    to: "/funnel",
    label: "Funnel",
    iconSrc: funnelBody,
    iconActiveSrc: funnelAccent,
    match: "/funnel",
  },
  {
    to: "/canales",
    label: "Canales",
    iconSrc: broadcastBody,
    iconActiveSrc: broadcastAccent,
    match: "/canales",
  },
  {
    to: "/segmentos",
    label: "Segmentos",
    iconSrc: peopleBody,
    iconActiveSrc: peopleAccent,
    match: "/segmentos",
  },
  {
    to: "/campanas",
    label: "Campañas",
    iconSrc: peopleBody,
    iconActiveSrc: peopleBody,
    match: "/campanas",
  },
  {
    to: "/experimentos",
    label: "Experimentos",
    iconSrc: graphUpArrowBody,
    iconActiveSrc: graphUpArrowAccent,
    match: "/experimentos",
  },
  {
    to: "/oportunidades",
    label: "Oportunidades",
    iconSrc: lightbulbBody,
    iconActiveSrc: lightbulbAccent,
    match: "/oportunidades",
  },
];

export const BREADCRUMBS: Record<string, string> = {
  "/": "GrowthHub / Resumen",
  "/funnel": "GrowthHub / Funnel",
  "/canales": "GrowthHub / Canales",
  "/segmentos": "GrowthHub / Segmentos",
  "/campanas": "GrowthHub / Campañas",
  "/oportunidades": "GrowthHub / Oportunidades",
  "/experimentos": "GrowthHub / Experimentos",
};