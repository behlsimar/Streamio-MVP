import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { CONFIG } from '../config';

type TitleType = 'movie' | 'series';

@Injectable()
export class StreamsService {
  private readonly logger = new Logger(StreamsService.name);

  private base = CONFIG.TORRENTIO_BASE;
  private query = CONFIG.TORRENTIO_QUERY;

  private async fetchJsonWithTimeout(url: string, ms = 8000): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'user-agent': 'Streamio/1.0 (+torrentio-aggregator)' }
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  private buildUrl(type: TitleType, imdbId: string) {
    const baseUrl = `${this.base}/stream/${type}/${imdbId}.json`;
    if (this.query && this.query.trim().length > 0) {
      return `${baseUrl}?${this.query}`;
    }
    return baseUrl;
  }

  async getStreams(type: TitleType, imdbId: string) {
    const url = this.buildUrl(type, imdbId);
    let all: any[] = [];

    try {
      const json = await this.fetchJsonWithTimeout(url);
      const streams = Array.isArray(json?.streams) ? json.streams : [];
      all = all.concat(streams);
    } catch (e: any) {
      this.logger.warn(`Torrentio failed: ${e?.message || e}`);
    }

    const seen = new Set<string>();
    const deduped = all.filter((s) => {
      const key = s.infoHash ? `${s.infoHash}:${s.name || ''}` : (s.url || JSON.stringify(s));
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const sorted = deduped.sort((a, b) => (b.seeds || 0) - (a.seeds || 0));
    return { streams: sorted.map(s => ({ ...s, unsafe: true })) };
  }
}
