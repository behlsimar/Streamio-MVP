# Streamio Backend – Complete

Endpoints
- `/` → health
- `/search?q=` → TMDB multi search (movies/series)
- `/streams/:type/:id` → Torrentio aggregator (IMDb or `tmdb:` IDs)

ID formats
- `tt1234567` (IMDb)
- `tmdb:movie:12345` or `tmdb:series:54321` (auto-resolves to IMDb)

## Deploy to Render (steps)
1. Create a new GitHub repo and push these files.
2. Create a new Render **Web Service** pointed at the repo.
3. Environment → add:
   - `TMDB_API_KEY` = your TMDB key (required)
   - (optional) `TORRENTIO_BASE` = https://torrentio.strem.fun
   - (optional) `TORRENTIO_QUERY` = e.g. `ranked=true&sort=quality,seeds`
4. Build Command: `npm run build`
5. Start Command: `npm start`
6. Open:
   - `/` → `{ "status": "ok" }`
   - `/search?q=avengers`
   - `/streams/movie/tt4154796`

## Local dev
```
npm i
cp .env.example .env  # add TMDB_API_KEY
npm run build
npm start
```
