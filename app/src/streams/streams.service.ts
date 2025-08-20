import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

type TitleType = 'movie' | 'series';

@Injectable()
export class StreamsService {
  private readonly logger = new Logger(StreamsService.name);

  private addons = [
    'https://torrentio.strem.fun'
  ];

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

  async getStreams(type: TitleType, imdbId: string) {
    let all: any[] = [];

    for (const base of this.addons) {
      const url = `${base}/stream/${type}/${imdbId}.json`;
      try {
        const json = await this.fetchJsonWithTimeout(url);
        const streams = Array.isArray(json?.streams) ? json.streams : [];
        all = all.concat(streams);
      } catch (e: any) {
        this.logger.warn(`Add-on failed ${base}: ${e?.message || e}`);
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    const deduped = all.filter((s) => {
      const key = s.infoHash ? `${s.infoHash}:${s.name || ''}` : (s.url || JSON.stringify(s));
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by seeds descending if available
    const sorted = deduped.sort((a, b) => (b.seeds || 0) - (a.seeds || 0));

    // Mark as unsafe for UI badge
    return { streams: sorted.map(s => ({ ...s, unsafe: true })) };
  }
}
