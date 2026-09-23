import searchIcon from "@/assets/icons/figma/search-primary.svg";
import calendarIcon from "@/assets/icons/figma/calendar-primary.svg";
import filterIcon from "@/assets/icons/figma/filter-primary.svg";

interface TopbarProps {
  breadcrumb: string;
  filters: {
    search: string;
    dateRange: string;
    channel: string;
  };
  variant?: "resumen" | "oportunidades" | "funnel" | "canales" | "experimentos";
}

export default function Topbar({
  breadcrumb,
  filters,
  variant = "resumen",
}: TopbarProps) {
  const className =
    variant === "oportunidades"
      ? "topbar topbar-oportunidades"
      : variant === "funnel"
        ? "topbar topbar-funnel"
        : variant === "canales"
          ? "topbar topbar-canales"
          : variant === "experimentos"
            ? "topbar topbar-experimentos"
            : "topbar";
  return (
    <header className={className}>
      <span className="topbar-breadcrumb">{breadcrumb}</span>
      <div className="topbar-filters">
        <div className="pill pill-search">
          <img className="pill-icon" src={searchIcon} alt="" />
          <span className="pill-text">{filters.search}</span>
        </div>
        <div className="pill pill-date">
          <img className="pill-icon" src={calendarIcon} alt="" />
          <span className="pill-text">{filters.dateRange}</span>
        </div>
        <div className="pill pill-channel">
          <img className="pill-icon" src={filterIcon} alt="" />
          <span className="pill-text">{filters.channel}</span>
        </div>
      </div>
    </header>
  );
}