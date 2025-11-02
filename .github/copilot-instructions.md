# GitHub Copilot Instructions for Event Manager PWA

## Project Overview
This is a Progressive Web App (PWA) for managing banquet hall events and services. It helps track service completion, assign contacts to tasks, and monitor overall event progress.

## Tech Stack
- **Frontend**: React (via CDN, no build process)
- **Styling**: Tailwind CSS (via CDN)
- **Storage**: LocalStorage for data persistence
- **Architecture**: Single HTML file with inline JavaScript

## Code Style & Conventions
## Copilot / Agent guidance — Event Manager (concise)

This repo is a lightweight PWA implemented as a single HTML file (`index.html`) using React via CDN and Tailwind via CDN. There is no build step. Keep changes small and inside `index.html` unless adding static assets (icons, manifest, service worker).

- Key files:
  - `index.html` — single-source app (components, state, icons live here).
  - `service-worker.js` — simple cache-on-install worker; runs only when served from localhost/HTTPS.
  - `manifest.webmanifest` — PWA metadata; icons expected under `/icons/`.

- Architecture / data flows (short):
  - UI/state lives in `BanquetEventApp` (in `index.html`).
  - Persistent state stored in localStorage under key `eventManagerData` with shape: { serviceStatuses, assignedContacts }. Example:
    ```javascript
    // Reading state on component mount
    useEffect(() => {
      const saved = localStorage.getItem('eventManagerData');
      if (saved) {
        const { serviceStatuses, assignedContacts } = JSON.parse(saved);
        setServiceStatuses(serviceStatuses || {});
        setAssignedContacts(assignedContacts || {});
      }
    }, []);

    // Writing state on updates
    useEffect(() => {
      localStorage.setItem('eventManagerData', JSON.stringify({ 
        serviceStatuses,  // { "core-Hall Rental": "completed" }
        assignedContacts  // { "core-Hall Rental": [{ id, name, phone, role }] }
      }));
    }, [serviceStatuses, assignedContacts]);
    ```
  - Service status keys use the unique format: `${categoryKey}-${serviceName}` (example: `core-Hall Rental`).
  - Contacts are arrays of objects: { id: string (timestamp), name: string, phone: string, role?: string }.

- Conventions agents should follow:
  - Single-file approach: avoid adding bundlers or new npm deps. Changes should be minimal and preserve the single HTML-script layout.
  - Use functional React components and hooks (the app uses useState/useEffect patterns).
  - Naming: components PascalCase (e.g., `ContactSelector`, `ServiceItem`), constants UPPER_SNAKE_CASE (`SERVICES_DATA`, `ROLE_OPTIONS`).
  - Icons are inline in the `Icons` object; reuse these rather than adding new SVG files unless necessary.

- PWA & serving notes (practical):
  - Service worker and installability require being served over HTTP(S) or `localhost`. For local testing in PowerShell, run:

    ```powershell
    # simple static server (Python)
    python -m http.server 8000
    # then open http://localhost:8000/
    ```

  - Editing `index.html` and reloading is the normal dev loop. Service worker updates may require unregistering or hard refresh during development.

- Data & extension rules (how to add features safely):
  - To add a new service: update `SERVICES_DATA` in `index.html` under the appropriate category; include `deps: []` if none. Example:
    ```javascript
    catering: { 
      title: "Catering & Food Services", 
      color: "bg-green-500", 
      items: [
        { name: "In-house Catering", deps: ["Hall Rental"] },
        // Add new service here:
        { name: "Dietary Options", deps: ["In-house Catering"] }
      ]
    }
    ```
  - To add roles: extend `ROLE_OPTIONS` (id, label, color) — role color uses Tailwind classes.
  - Persisted keys: `serviceStatuses` values are `'completed' | 'not-required' | undefined`.

- Quick checks for agents changing behavior:
  - Verify localStorage reads/writes in `useEffect` (search for `eventManagerData`).
  - If UI breaks, check console for React/Babel runtime errors; because the app uses Babel standalone, syntax must be browser-compatible.

- Hard constraints / don'ts (project-specific):
  - Do not introduce Node/npm-based build tooling or external runtime dependencies — this repo is intentionally zero-build.
  - Keep styling via Tailwind classes (via CDN). Avoid adding new CSS frameworks.

If anything in the app is unclear or you want longer-form guidance (linting, tests, or migrating to a multi-file structure), tell me which area to expand and I’ll iterate.

---

Files referenced while writing this: `index.html`, `service-worker.js`, `manifest.webmanifest`.

If this matches your expectations I will commit; otherwise tell me what to add (dev server commands, preferred local test steps, additional coding patterns).
