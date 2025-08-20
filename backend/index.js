import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { tmdb, normalizeSearchResult, normalizeMeta } from './tmdb.js';
import { listAddons, toggleAddon, streamsFor } from './addons.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true }));

app.get('/search', async (req, res) => {
  try {
    const q = (req.query.query || '').toString().trim();
    if (!q) return res.json({ results: [] });
    const data = await tmdb('/search/multi', { query: q, include_adult: 'false', language: 'en-US', page: '1' });
    const results = (data.results || [])
      .filter(x => ['movie','tv'].includes(x.media_type))
      .map(normalizeSearchResult);
    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/catalog/:type/:list', async (req, res) => {
  try {
    const { type, list } = req.params;
    let path = `/trending/${type}/day`;
    if (list === 'popular') path = `/${type}/popular`;
    if (list === 'top_rated') path = `/${type}/top_rated`;
    const data = await tmdb(path, { language: 'en-US', page: '1' });
    const results = (data.results || []).map(x => normalizeSearchResult({ ...x, media_type: type }));
    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/meta/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const details = await tmdb(`/${type}/${id}`, { language: 'en-US', append_to_response: 'credits,videos' });
    const meta = normalizeMeta(type, details);
    meta.credits = {
      cast: (details.credits?.cast || []).slice(0,12).map(c => ({ id: c.id, name: c.name, character: c.character })),
      crew: (details.credits?.crew || []).slice(0,6).map(c => ({ id: c.id, name: c.name, job: c.job })),
    };
    meta.videos = details.videos;
    res.json({ meta });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/providers/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const region = (req.query.region || 'AU').toString();
    const data = await tmdb(`/${type}/${id}/watch/providers`);
    const r = data.results?.[region] || {};
    res.json({ region, providers: r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/addons', (req, res) => res.json({ addons: listAddons() }));
app.post('/addons/toggle', (req, res) => {
  const { key, enabled } = req.body || {};
  const list = toggleAddon(key, !!enabled);
  res.json({ addons: list });
});

app.get('/streams/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const details = await tmdb(`/${type}/${id}`, { language: 'en-US', append_to_response: 'videos' });
    const meta = { title: details.title || details.name, videos: details.videos };
    const streams = await streamsFor({ type, id, meta });
    res.json({ streams });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('MVP Backend listening on :' + PORT));