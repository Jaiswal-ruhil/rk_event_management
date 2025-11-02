# Event Manager (Banquet Hall)

A small single-file Progressive Web App (PWA) to manage banquet hall services, assign contacts, and track event progress.

## Files added
- `index.html` — Single-file React app (via CDN) with inline JavaScript and Tailwind CSS.
- `manifest.webmanifest` — Minimal PWA manifest.
- `service-worker.js` — Simple service worker that caches the basic app shell.

## Run locally
1. Serve the folder with a static server (required for service worker/manifest). Example using PowerShell and Python 3:

```powershell
# From repository root
python -m http.server 5173
# Then open http://localhost:5173 in your browser
```

2. Open the site in Chrome or Safari. On supported devices you can "Install" the app.

## Notes and next steps
- The manifest references `/icons/icon-192.png` and `/icons/icon-512.png`. Add proper app icons at `icons/` or adjust `manifest.webmanifest`.
- The service worker is intentionally minimal. You may extend it to cache CDN assets and provide better offline fallbacks.
- If you want, I can:
  - Add sample icons (192/512)
  - Improve the service worker with runtime caching strategies
  - Commit and push the changes for you

