// src/utils/normalize.js
export function normalizePlaylist(p) {
  if (!p) return null;
  if (p.name && p.image && p.tracks && p.external_url) return p; // already normalized

  return {
    id: p.id || p.playlist_id,
    name: p.name || '',
    image: p.image || '',
    tracks: p.tracks || 0,
    external_url: p.external_url || '',
  };
}