# Frontend — Plateforme de régulation des télécommunications

React 19 + TypeScript + Vite, React Router, Recharts, Tailwind CSS 4.

## Démarrage
```bash
cp .env.example .env            # VITE_API_URL=http://localhost:8000/api/v1
npm install --legacy-peer-deps
npm run dev                     # http://localhost:5173
npm run build                   # tsc -b && vite build
npm run lint
```
Le backend (dossier `backend/project`) doit tourner sur le port 8000, et l'origine du frontend doit figurer dans `CORS_ALLOWED_ORIGINS` du `.env` du backend.

## Organisation
* `src/lib/api.ts` : client HTTP (JWT, renouvellement automatique, erreurs uniformes)
* `src/lib/auth-context.ts`, `AuthProvider.tsx`, `RequireSpace.tsx` : session et garde d'interface (les permissions réelles sont appliquées par le serveur)
* `src/pages/PublicLive.tsx` : sondages et publications publics (API)
* `src/pages/Workspace.tsx` : pages des espaces ARTEC Régulation, ARTEC Publications et opérateur (API)
* `src/pages/Dashboards.tsx`, `src/data/demo.ts` : tableaux de bord encore alimentés par des données de démonstration

## Ce qui reste branché sur des données de démonstration
Tableaux de bord d'accueil des trois espaces et page « Prédictions » ; formulaires de création de sondage, de décision réglementaire et de seuils QoS (les endpoints existent côté backend).
