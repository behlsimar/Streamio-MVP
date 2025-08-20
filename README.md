# Streamio Combined MVP (Backend + App UI)

Minimal edits: set one env var on Render and one URL in a config file.

## Backend (Render)
1) Deploy `backend/` to Render (Node).
2) Add env var: `TMDB_API_KEY=YOUR_TMDB_V3_KEY`
3) Test: `https://YOUR-RENDER-URL/search?query=avengers`

## App UI (Expo/React Native)
- Copy `app/src/` into your project's `src/` (merge/replace).
- Set `src/config.ts`: BACKEND_URL='https://YOUR-RENDER-URL'
- Ensure your root uses `src/App.tsx` (it renders the Tabs navigator).