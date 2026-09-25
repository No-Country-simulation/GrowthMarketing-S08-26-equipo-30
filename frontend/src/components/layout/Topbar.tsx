import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "@/assets/icons/figma/search-primary.svg";
import calendarIcon from "@/assets/icons/figma/calendar-primary.svg";
import filterIcon from "@/assets/icons/figma/filter-primary.svg";
import arrowRightIcon from "@/assets/icons/figma/arrow-right-short.svg";
import { useDemo } from "@/demo/DemoProvider";
import { DATE_RANGE_LABELS } from "@/demo/demoScenarios";
import { selectGlobalSearchResults } from "@/demo/demoSelectors";
import type { DateRange } from "@/demo/demoTypes";

export type TopbarVariant =
  | "resumen"
  | "oportunidades"
  | "funnel"
  | "canales"
  | "experimentos"
  | "campanas"
  | "segmentos";

interface TopbarProps {
  breadcrumb: string;
  variant: TopbarVariant;
  showGlobalSearch?: boolean;
}

const VARIANT_CLASS: Record<TopbarVariant, string> = {
  resumen: "topbar",
  oportunidades: "topbar topbar-oportunidades",
  funnel: "topbar topbar-funnel",
  canales: "topbar topbar-canales",
  experimentos: "topbar topbar-experimentos",
  campanas: "topbar topbar-campanas",
  segmentos: "topbar topbar-segmentos",
};

export default function Topbar({
  breadcrumb,
  variant,
  showGlobalSearch = false,
}: TopbarProps) {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const { filters } = state;
  const [openMenu, setOpenMenu] = useState<"date" | "channel" | null>(null);
  const topbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openMenu) {
      return;
    }
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (topbarRef.current && !topbarRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  const globalResults = showGlobalSearch
    ? selectGlobalSearchResults(state, filters.search)
    : null;
  const hasGlobalResults =
    !!globalResults &&
    (globalResults.campaigns.length > 0 ||
      globalResults.segments.length > 0 ||
      globalResults.opportunities.length > 0 ||
      globalResults.experiments.length > 0);
  const showEmptySearch =
    showGlobalSearch && filters.search.trim().length > 0 && !hasGlobalResults;

  const selectedChannel = state.channels.find(
    (channel) => channel.id === filters.channelId,
  );

  return (
    <header ref={topbarRef} className={VARIANT_CLASS[variant]}>
      <span className="topbar-breadcrumb">{breadcrumb}</span>
      <div className="topbar-filters">
        <div className="filter-menu filter-menu-search">
          <div className="pill pill-search">
            <img className="pill-icon" src={searchIcon} alt="" />
            <input
              className="pill-search-input"
              type="text"
              value={filters.search}
              onChange={(event) =>
                dispatch({ type: "SET_SEARCH", search: event.target.value })
              }
              placeholder="Buscar..."
              aria-label="Buscar"
            />
          </div>
          {showGlobalSearch && filters.search.trim().length > 0 ? (
            <div className="topbar-search-results" role="listbox">
              {showEmptySearch ? (
                <div className="topbar-search-empty">
                  No hay resultados para “{filters.search.trim()}”.
                </div>
              ) : null}
              {globalResults?.campaigns.length ? (
                <SearchGroup
                  title="Campañas"
                  items={globalResults.campaigns.map((item) => ({
                    id: item.id,
                    label: item.title,
                    onClick: () => navigate(item.to),
                  }))}
                />
              ) : null}
              {globalResults?.segments.length ? (
                <SearchGroup
                  title="Segmentos"
                  items={globalResults.segments.map((item) => ({
                    id: item.id,
                    label: item.name,
                    onClick: () => navigate(item.to),
                  }))}
                />
              ) : null}
              {globalResults?.opportunities.length ? (
                <SearchGroup
                  title="Oportunidades"
                  items={globalResults.opportunities.map((item) => ({
                    id: item.id,
                    label: item.title,
                    onClick: () => navigate(item.to),
                  }))}
                />
              ) : null}
              {globalResults?.experiments.length ? (
                <SearchGroup
                  title="Experimentos"
                  items={globalResults.experiments.map((item) => ({
                    id: item.id,
                    label: item.title,
                    onClick: () => navigate(item.to),
                  }))}
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="filter-menu">
          <button
            type="button"
            className="pill pill-date"
            onClick={() =>
              setOpenMenu((current) => (current === "date" ? null : "date"))
            }
            aria-haspopup="listbox"
            aria-expanded={openMenu === "date"}
          >
            <img className="pill-icon" src={calendarIcon} alt="" />
            <span className="pill-text">
              {DATE_RANGE_LABELS[filters.dateRange].label}
            </span>
          </button>
          {openMenu === "date" ? (
            <div className="filter-dropdown" role="listbox">
              {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  role="option"
                  aria-selected={filters.dateRange === range}
                  className={`filter-option${
                    filters.dateRange === range ? " filter-option-active" : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "SET_DATE_RANGE", dateRange: range });
                    setOpenMenu(null);
                  }}
                >
                  <span className="filter-option-label">
                    {DATE_RANGE_LABELS[range].label}
                  </span>
                  <span className="filter-option-range">
                    {DATE_RANGE_LABELS[range].range}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="filter-menu">
          <button
            type="button"
            className="pill pill-channel"
            onClick={() =>
              setOpenMenu((current) => (current === "channel" ? null : "channel"))
            }
            aria-haspopup="listbox"
            aria-expanded={openMenu === "channel"}
          >
            <img className="pill-icon" src={filterIcon} alt="" />
            <span className="pill-text">
              {filters.channelId === "all"
                ? "Todos los canales"
                : selectedChannel?.name ?? "Todos los canales"}
            </span>
          </button>
          {openMenu === "channel" ? (
            <div className="filter-dropdown filter-dropdown-channel" role="listbox">
              <button
                type="button"
                role="option"
                aria-selected={filters.channelId === "all"}
                className={`filter-option${
                  filters.channelId === "all" ? " filter-option-active" : ""
                }`}
                onClick={() => {
                  dispatch({ type: "SET_CHANNEL", channelId: "all" });
                  setOpenMenu(null);
                }}
              >
                <span className="filter-option-label">Todos los canales</span>
              </button>
              {state.channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  role="option"
                  aria-selected={filters.channelId === channel.id}
                  className={`filter-option${
                    filters.channelId === channel.id
                      ? " filter-option-active"
                      : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "SET_CHANNEL", channelId: channel.id });
                    setOpenMenu(null);
                  }}
                >
                  <span className="filter-option-label">{channel.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SearchGroup({
  title,
  items,
}: {
  title: string;
  items: { id: string; label: string; onClick: () => void }[];
}) {
  return (
    <div className="topbar-search-group">
      <span className="topbar-search-group-title">{title}</span>
      {items.map((item) => (
        <button
          key={`${title}-${item.id}`}
          type="button"
          className="topbar-search-item"
          onClick={item.onClick}
          role="option"
        >
          <span className="topbar-search-item-label">{item.label}</span>
          <img className="topbar-search-item-icon" src={arrowRightIcon} alt="" />
        </button>
      ))}
    </div>
  );
}