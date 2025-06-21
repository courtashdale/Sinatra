// src/components/FeaturedPlaylists.jsx
import React, { useMemo } from 'react';
import { motion } from '@motionone/react';
import PlaylistCardMini from './PlaylistCardMini';
import { normalizePlaylist } from '../utils/normalize';

function FeaturedPlaylists({ playlists = [], onSeeAll }) {
  const validPlaylists = useMemo(() => {
    return playlists
      .filter((p) => p && (p.id || p.playlist_id))
      .map(normalizePlaylist)
      .sort((a, b) => b.tracks - a.tracks)
      .slice(0, 3);
  }, [playlists]);

  if (validPlaylists.length === 0) {
    return (
      <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        ⚠️ None selected!
      </motion.div>
    );
  }

  return (
    <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mt-3">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-lg flex items-center gap-1">
          <span className="text-base leading-none">🌟</span>
          <span className="leading-none">Featured Playlists</span>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm underline text-blue-600 dark:text-blue-400 leading-none"
          >
            See All →
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {validPlaylists.map((playlist, i) => (
          <PlaylistCardMini
            key={playlist.id || playlist.playlist_id}
            playlist={playlist}
            index={i}
            showTracks
          />
        ))}
      </div>
    </motion.div>
  );
}

export default FeaturedPlaylists;
