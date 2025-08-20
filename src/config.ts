export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  TORRENTIO_BASE: process.env.TORRENTIO_BASE || 'https://torrentio.strem.fun',
  TORRENTIO_QUERY: process.env.TORRENTIO_QUERY || '',
};
