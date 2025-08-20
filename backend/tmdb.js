import fetch from 'node-fetch';
const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
function mustKey(){ if(!TMDB_KEY) throw new Error('TMDB_API_KEY missing'); }
export async function tmdb(path, params = {}) {
  mustKey();
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', TMDB_KEY);
  for (const [k,v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error('TMDb error ' + r.status);
  return r.json();
}
export function img(path, size='w342'){ return path ? `https://image.tmdb.org/t/p/${size}${path}` : null; }
export function normalizeSearchResult(x){
  const media_type = x.media_type || (x.title ? 'movie' : 'tv');
  return { id: `${media_type}:${x.id}`, type: media_type, title: x.title||x.name||'', year: (x.release_date||x.first_air_date||'').slice(0,4),
    overview: x.overview||'', poster: img(x.poster_path,'w342'), backdrop: img(x.backdrop_path,'w780'), rating: x.vote_average ?? null };
}
export function normalizeMeta(type, x){
  return { id:`${type}:${x.id}`, type, title:x.title||x.name||'', year:(x.release_date||x.first_air_date||'').slice(0,4),
    overview:x.overview||'', poster:img(x.poster_path,'w500'), backdrop:img(x.backdrop_path,'w1280'),
    genres:(x.genres||[]).map(g=>g.name), runtime:x.runtime || (x.episode_run_time?.[0]||null), seasons:x.seasons||undefined, rating:x.vote_average ?? null };
}