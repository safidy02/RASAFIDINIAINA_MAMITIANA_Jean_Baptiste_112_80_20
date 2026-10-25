import { createBrowserRouter } from "react-router"
import PublicLayout from "../components/PublicLayout"
import AppLayout from "../components/AppLayout"
import { HomePage, PlaceholderPublicPage } from "../pages/PublicPages"
import { PublicationDetailPage, PublicationsPage, SurveyFormPage, SurveysPage } from "../pages/PublicLive"
import { RequireSpace } from "../lib/RequireSpace"
import * as W from "../pages/Workspace"
import LoginPage from "../pages/LoginPage"
import Dashboard, { GenericAppPage, PredictionPage } from "../pages/Dashboards"

const publicPlaceholder = (title: string) => (
  <PlaceholderPublicPage title={title} />
)
const appPlaceholder = (title: string) => <GenericAppPage title={title} />

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "publications", Component: PublicationsPage },
      { path: "publications/:slug", Component: PublicationDetailPage },
      { path: "sondages", Component: SurveysPage },
      { path: "sondages/:id", Component: SurveyFormPage },
      { path: "qualite", element: publicPlaceholder("Qualité des services") },
      { path: "rapports", element: publicPlaceholder("Rapports publics") },
      {
        path: "a-propos",
        element: publicPlaceholder("À propos de la plateforme"),
      },
      {
        path: "confidentialite",
        element: publicPlaceholder("Politique de confidentialité"),
      },
      { path: "accessibilite", element: publicPlaceholder("Accessibilité") },
      { path: "*", element: publicPlaceholder("Page introuvable") },
    ],
  },
  { path: "/connexion", Component: LoginPage },
  {
    path: "/regulation",
    element: (
      <RequireSpace spaces={["regulation", "admin"]}>
        <AppLayout mode="regulation" />
      </RequireSpace>
    ),
    children: [
      { index: true, element: <Dashboard mode="regulation" /> },
      { path: "predictions", Component: PredictionPage },
      { path: "soumissions", Component: W.RegulationSubmissions },
      { path: "dossiers", Component: W.RegulationCases },
      { path: "indicateurs", Component: W.QosPage },
      { path: "modeles", Component: W.ModelsPage },
      { path: "historique", Component: W.AuditPage },
      { path: "notifications", Component: W.NotificationsPage },
      { path: "*", element: appPlaceholder("Module de régulation") },
    ],
  },
  {
    path: "/operateur",
    element: (
      <RequireSpace spaces={["operator"]}>
        <AppLayout mode="operator" />
      </RequireSpace>
    ),
    children: [
      { index: true, element: <Dashboard mode="operator" /> },
      { path: "datasets", Component: W.OperatorDatasets },
      { path: "importation", Component: W.OperatorDatasets },
      { path: "soumissions", Component: W.OperatorSubmissions },
      { path: "reclamations", Component: W.ComplaintsPage },
      { path: "scraping", Component: W.ScrapingPage },
      { path: "notifications", Component: W.NotificationsPage },
      { path: "*", element: appPlaceholder("Gestion opérateur") },
    ],
  },
  {
    path: "/publications-admin",
    element: (
      <RequireSpace spaces={["publications"]}>
        <AppLayout mode="publications" />
      </RequireSpace>
    ),
    children: [
      { index: true, element: <Dashboard mode="publications" /> },
      { path: "contenus", Component: W.PublicationsAdmin },
      { path: "sondages", Component: W.SurveysAdmin },
      { path: "commentaires", Component: W.CommentsAdmin },
      { path: "historique", Component: W.AuditPage },
      { path: "notifications", Component: W.NotificationsPage },
      { path: "*", element: appPlaceholder("Gestion éditoriale") },
    ],
  },
])
