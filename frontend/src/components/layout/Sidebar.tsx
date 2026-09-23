import type { AppView, NavItem } from "@/components/layout/layoutTypes";

interface SidebarProps {
  nav: NavItem[];
  user: {
    initials: string;
    name: string;
    role: string;
  };
  onNavigate: (view: AppView) => void;
}

export default function Sidebar({ nav, user, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <span className="logo-growth">Growth</span>
          <span className="logo-hub">Hub</span>
        </div>
        <div className="sidebar-menu">
          <span className="sidebar-section">Análisis</span>
          <nav className="sidebar-nav">
            {nav.map((item) => {
              const target = item.targetView;
              const className = `nav-item${item.active ? " nav-item-active" : ""}`;
              return target ? (
                <button
                  key={item.id}
                  type="button"
                  className={className}
                  onClick={() => onNavigate(target)}
                >
                  <img className="nav-icon" src={item.iconSrc} alt="" />
                  <span className="nav-label">{item.label}</span>
                </button>
              ) : (
                <a key={item.id} href="#" className={className}>
                  <img className="nav-icon" src={item.iconSrc} alt="" />
                  <span className="nav-label">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="sidebar-user">
        <div className="user-avatar">{user.initials}</div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </div>
    </aside>
  );
}