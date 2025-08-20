import { BACKEND_URL } from './config';
async function j(url: string, init?: RequestInit){ const r = await fetch(url, init); if(!r.ok) throw new Error(await r.text()); return r.json(); }
export const api = {
  search: (q: string) => j(`${BACKEND_URL}/search?query=${encodeURIComponent(q)}`),
  catalog: (type: 'movie'|'tv', list: 'trending'|'popular'|'top_rated') => j(`${BACKEND_URL}/catalog/${type}/${list}`),
  meta: (type: 'movie'|'tv', id: string) => j(`${BACKEND_URL}/meta/${type}/${id}`),
  providers: (type: 'movie'|'tv', id: string, region='AU') => j(`${BACKEND_URL}/providers/${type}/${id}?region=${region}`),
  addons: () => j(`${BACKEND_URL}/addons`),
  toggleAddon: (key: string, enabled: boolean) => j(`${BACKEND_URL}/addons/toggle`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ key, enabled }) }),
  streams: (type: 'movie'|'tv', id: string) => j(`${BACKEND_URL}/streams/${type}/${id}`),
};