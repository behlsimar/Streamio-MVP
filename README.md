# Streamio Backend (Minimal) – Torrentio + TMDB

This is a lightweight NestJS backend that provides:
- `/search?q=` → TMDB search (movies/series)  
- `/streams/:type/:id` → Torrentio aggregator (real torrents)

> ID formats accepted by `/streams`:
> - `tt1234567` (IMDb)  
> - `tmdb:movie:12345` or `tmdb:series:54321` (auto-resolves to IMDb)

## Quick Start (Local)

1) Install deps:
```
npm i
```

2) Create `.env`:
```
TMDB_API_KEY=YOUR_TMDB_API_KEY
PORT=3000
```

3) Run:
```
npm run build && npm start
```

Open:
- http://localhost:3000/ → health
- http://localhost:3000/search?q=avengers
- http://localhost:3000/streams/movie/tt4154796
- http://localhost:3000/streams/movie/tmdb:movie:299534

## Deploy to Render

- Push this repo to GitHub
- Create a new **Web Service**
- Environment:
  - `TMDB_API_KEY` = your key
  - `PORT` = 10000 (or leave blank; Render injects PORT)
- Build Command: `npm run build`
- Start Command: `npm start`

## Notes

- This backend marks Torrentio streams with `"unsafe": true`. You should display a warning in your app.
- Next step: integrate Real-Debrid to convert magnet links into playable HTTPS streams.
