import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

type TitleType = 'movie' | 'series';

@Injectable()
export class IdResolverService {
  async toImdbId(type: TitleType, id: string): Promise<string> {
    // already imdb format
    if (id.startsWith('tt') && /^tt\d+$/.test(id)) return id;

    // tmdb pattern: tmdb:{type}:{id}
    const tmdbMatch = id.match(/^tmdb:(movie|series|show|tv):(\d+)$/i);
    if (tmdbMatch) {
      const tmdbType = tmdbMatch[1].toLowerCase();
      const tmdbId = tmdbMatch[2];
      const isTv = tmdbType === 'series' || tmdbType === 'tv';

      const key = process.env.TMDB_API_KEY;
      if (!key) throw new Error('TMDB_API_KEY missing');

      const base = 'https://api.themoviedb.org/3';
      const path = isTv ? `/tv/${tmdbId}` : `/movie/${tmdbId}`;
      const url = `${base}${path}?api_key=${encodeURIComponent(key)}&append_to_response=external_ids`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`TMDB details failed: ${res.status}`);
      const data = await res.json();

      const imdb = data?.external_ids?.imdb_id || data?.imdb_id;
      if (!imdb) throw new Error('No imdb_id found for this TMDB item');
      return imdb;
    }

    // plain numeric → assume tmdb of provided type
    if (/^\d+$/.test(id)) {
      return this.toImdbId(type, `tmdb:${type}:${id}`);
    }

    // last resort: return raw
    return id;
  }
}
