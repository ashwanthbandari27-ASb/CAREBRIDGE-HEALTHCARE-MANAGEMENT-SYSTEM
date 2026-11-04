# Frontend

## Technologies

- React 19 and TypeScript 7
- Vite 8 for development and production builds
- React Router for the landing, login, patient, doctor, and admin routes
- Lucide React for icons and Recharts for dashboard charts
- Supabase JavaScript client for authentication

## Structure

```text
frontend/
├── public/                 # Static files served from the site root, including file preview
└── src/
    ├── assets/             # Imported images and asset files
    ├── components/         # Shared UI components, including Brand
    ├── pages/              # Route definitions and page/dashboard UI
    ├── services/           # Supabase client configuration
    ├── styles/             # Active global styles and retained legacy styles
    │   ├── responsive.css  # Responsive layout and accessibility refinements
    │   └── archive/        # Preserved pre-Supabase stylesheet backup
    ├── App.tsx             # App entry component
    ├── App.pre-supabase.backup.tsx # Preserved historical source backup
    └── main.tsx            # React DOM entry point
```

`frontend/src/pages/AppRoutes.tsx` contains the current landing page, login screen, patient dashboard and sections, role dashboards, and route protection. `frontend/src/components/Brand.tsx` is the reusable brand mark. `frontend/src/styles/index.css` contains the existing application styles, with `responsive.css` providing responsive layout and keyboard-focus refinements. Dashboard search navigates matching application sections (`Ctrl+K` focuses it on desktop), and the pharmacy search filters the displayed sample products. Some features are interactive demonstrations and show hard-coded sample content.

The repository-root `index.html` also loads a read-only, file-open preview from `frontend/public/preview.css` and `frontend/public/preview.js` when opened directly from disk. For sign-in, Supabase access, and the complete React application, run `npm run dev` from the repository root.

The root `index.html` and `vite.config.ts` are intentionally left at the repository root: Vite uses the root HTML as its entry point. Vite serves static files from `frontend/public`, and `tsconfig.app.json` checks `frontend/src`.

## Authentication and environment

The frontend reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the local environment using the `VITE_` prefix. These are public client settings; do not put a service-role key, database password, or other server secret in the frontend. The login page supports password sign-in and password-reset requests when Supabase is configured. The UI provides demo-role navigation; it does not implement a registration flow.

## Run

From the repository root, run `npm install` when dependencies are not installed, then `npm run dev`. Use `npm run build` for a TypeScript check and production build.
