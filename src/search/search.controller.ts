import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import fetch from 'node-fetch';
import { CONFIG } from '../config';

@Controller('search')
export class SearchController {
  @Get()
  async search(@Query('q') q?: string) {
    if (!q) throw new BadRequestException('Missing query ?q=');

    const key = CONFIG.TMDB_API_KEY;
    if (!key) throw new BadRequestException('TMDB_API_KEY is not configured');

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(q)}&include_adult=false`;
    const res = await fetch(url);
    if (!res.ok) throw new BadRequestException(`TMDB search failed: ${res.status}`);
    const data = await res.json();

    const items = (data?.results || [])
      .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
      .map((r: any) => {
        const type = r.media_type === 'movie' ? 'movie' : 'series';
        const tmdbId = r.id;
        return {
          type,
          title: r.title || r.name,
          year: (r.release_date || r.first_air_date || '').split('-')[0] || null,
          overview: r.overview || '',
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : null,
          backdrop: r.backdrop_path ? `https://image.tmdb.org/t/p/w780${r.backdrop_path}` : null,
          id: `tmdb:${type}:${tmdbId}`,
          popularity: r.popularity,
          vote_average: r.vote_average,
        };
      });

    return { results: items };
  }
}
