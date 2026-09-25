import { NavLink, useLocation } from "react-router-dom";
import UserMenu from "@/components/layout/UserMenu";
import { DEMO_NAV } from "@/components/layout/navConfig";

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <span className="logo-growth">Growth</span>
          <span className="logo-hub">Hub</span>
        </div>
        <div className="sidebar-menu">
          <span className="sidebar-section">Análisis</span>
          <nav className="sidebar-nav" aria-label="Navegación principal">
            {DEMO_NAV.map((item) => {
              const active =
                item.match === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.match);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.match === "/"}
                  className={`nav-item${active ? " nav-item-active" : ""}`}
                >
                  <img
                    className="nav-icon"
                    src={active ? item.iconActiveSrc : item.iconSrc}
                    alt=""
                  />
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      <UserMenu />
    </aside>
  );
}