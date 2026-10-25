import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"
import { useAuth } from "../lib/auth-context"
import { api } from "../lib/api"
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Database,
  FileBarChart,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  PanelLeftClose,
  ScanSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react"
import { Avatar, Badge, Button, Text } from "./ui"

type Mode = "regulation" | "operator" | "publications"

const config = {
  regulation: {
    label: "ARTEC — Régulation",
    initials: "AR",
    user: "Direction de la régulation",
    nav: [
      ["Vue d’ensemble", "/regulation", LayoutDashboard],
      ["Soumissions", "/regulation/soumissions", Database],
      ["Prédictions", "/regulation/predictions", Sparkles],
      ["Dossiers réglementaires", "/regulation/dossiers", FileText],
      ["Indicateurs QoS", "/regulation/indicateurs", Gauge],
      ["Modèles", "/regulation/modeles", ScanSearch],
      ["Historique", "/regulation/historique", History],
    ],
  },
  operator: {
    label: "Espace opérateur",
    initials: "YS",
    user: "YAS Madagascar",
    nav: [
      ["Vue d’ensemble", "/operateur", LayoutDashboard],
      ["Publications et sondages", "/operateur/sondages", BookOpen],
      ["Résultats de collecte", "/operateur/resultats", FileBarChart],
      ["Datasets", "/operateur/datasets", Database],
      ["Importation", "/operateur/importation", Upload],
      ["Web scraping", "/operateur/scraping", ScanSearch],
      ["Soumissions à l’ARTEC", "/operateur/soumissions", FileText],
      ["Réclamations", "/operateur/reclamations", MessageSquareWarning],
    ],
  },
  publications: {
    label: "ARTEC — Publications",
    initials: "AP",
    user: "Cellule publications",
    nav: [
      ["Vue d’ensemble", "/publications-admin", LayoutDashboard],
      ["Publications", "/publications-admin/contenus", FileText],
      ["Sondages", "/publications-admin/sondages", BookOpen],
      [
        "Commentaires",
        "/publications-admin/commentaires",
        MessageSquareWarning,
      ],
      ["Audience", "/publications-admin/audience", Users],
      ["Historique", "/publications-admin/historique", History],
    ],
  },
}

export default function AppLayout({ mode }: { mode: Mode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    let alive = true
    const load = () =>
      api<{ count: number }>("/notifications/unread-count/")
        .then((d) => alive && setUnread(d.count))
        .catch(() => undefined)
    load()
    const t = window.setInterval(load, 60000)
    return () => {
      alive = false
      window.clearInterval(t)
    }
  }, [])
  const base = config[mode]
  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : base.user
  const current = {
    ...base,
    user: user?.organization ? `${user.organization.name}` : fullName,
    initials: (fullName.match(/\b\w/g) ?? ["?"]).slice(0, 2).join("").toUpperCase(),
  }
  const doLogout = async () => {
    await logout()
    navigate("/connexion", { replace: true })
  }
  const basePath = mode === "publications" ? "/publications-admin" : `/${mode}`
  const activeLabel =
    current.nav.find(([, path]) =>
      path === `/${mode === "publications" ? "publications-admin" : mode}`
        ? location.pathname === path
        : location.pathname.startsWith(path as string),
    )?.[0] ?? "Vue d’ensemble"

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className={mobileOpen ? "sidebar sidebar-open" : "sidebar"}>
        <div className="sidebar-head">
          <Link to="/" className="app-brand">
            <span className="brand-mark">
              <ShieldCheck size={23} />
            </span>
            <span className="brand-copy">
              <strong>QoS Madagascar</strong>
              <small>{current.label}</small>
            </span>
          </Link>
          <Button
            variant="ghost"
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="org-chip">
          <Avatar initials={current.initials} />
          <span>
            <strong>{current.user}</strong>
            <small>Espace sécurisé</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav">
          <Text as="small" className="nav-section">
            NAVIGATION
          </Text>
          {current.nav.map(([label, path, Icon]) => (
            <NavLink
              key={path as string}
              to={path as string}
              end={path === `/${mode}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} />
              <span>{label as string}</span>
            </NavLink>
          ))}
          <Text as="small" className="nav-section nav-section-bottom">
            COMPTE
          </Text>
          <NavLink to={`${basePath}/notifications`}>
            <Bell size={19} />
            <span>Notifications</span>
            <Badge tone="blue">3</Badge>
          </NavLink>
          <NavLink to={`${basePath}/parametres`}>
            <Settings size={19} />
            <span>Paramètres</span>
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <Link to="/aide">
            <CircleHelp size={19} />
            <span>Centre d’aide</span>
          </Link>
          <button type="button" className="nav-logout" onClick={doLogout}>
            <LogOut size={19} />
            <span>Déconnexion</span>
          </button>
          <Button
            variant="ghost"
            className="collapse-button"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeftClose size={18} />
            <span>Réduire le menu</span>
          </Button>
        </div>
      </aside>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <Button
              variant="ghost"
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </Button>
            <div>
              <Text as="small">Tableau de bord</Text>
              <strong>{activeLabel as string}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <Button
              variant="ghost"
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unread > 0 && <span className="notification-dot" title={`${unread} non lue(s)`} />}
            </Button>
            <div className="profile">
              <Avatar initials={current.initials} />
              <span>
                <strong>{current.user}</strong>
                <small>{user?.email}</small>
              </span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
