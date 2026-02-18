# BizOp - Multi-Profession ERP

## Architecture Overview
This application is built as a modular feature-flagged platform. Instead of separate apps for each profession, it uses a **Unified Toolset** where professions are simply "presets" of available modules.

### Folder Structure
- `/features`: Redux slices for global state (Finance, Inventory, Repairs, and a new `configSlice` for Shop settings).
- `/pages`: 
  - `Home.tsx`: The Profession selector (Landing Page).
  - `ProfessionTools.tsx`: Dynamic route that renders a specific suite of tools.
  - `CustomTools.tsx`: Selection interface for building custom workflows.
- `/components`:
  - `Layout.tsx`: Handles the Rainbow border, Sidebar, and Live Clock.
  - `ToolModules/`: (Conceptually) The individual widgets like Billing, POS, EHR.

### Design System
- **Colors**: DodgerBlue (#1e90ff) for primary actions.
- **Accents**: Rainbow gradient borders (`linear-gradient(to right, #4285F4, #34A853, #FBBC05, #EA4335)`).
- **Background**: High-contrast white for a professional SaaS feel.

### Persistence
The full application state is persisted in `IndexedDB` (`bizop-db`) so onboarding, tool selection, tasks, and working data survive browser restarts.

### Security and Cloud Sync
- Firebase auth uses Google sign-in with profile-first onboarding.
- Firestore user scope is `users/{uid}/profile/data`, `users/{uid}/dashboard/data`, `users/{uid}/inventory/data`, `users/{uid}/tasks/data`.
- Free plan keeps operational data in IndexedDB only; Pro/Business sync to Firestore; Admin writes directly to Firestore.
- Tenant isolation rules are defined in `firestore.rules` and `firebase.security.json`.

# DX-tools

## Netlify Deploy (Manual Ready)
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing is already configured via `public/_redirects` and `netlify.toml`.
- If deploying from Netlify UI:
  1. Build locally with `npm run build`
  2. Upload the `dist` folder (contains `_redirects` for routing fallback)
