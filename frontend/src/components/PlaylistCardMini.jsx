// src/components/PlaylistCardMini.jsx
import React from 'react';
import { motion } from '@motionone/react';
import { cn } from '../utils/cn'; // Replace with template strings if not using cn()

function PlaylistCardMini({
  playlist,
  onClick = null,
  isSelected = false,
  selectable = false,
  showTracks = true,
  className = '',
  index = 0, // for motion delay
}) {
  const {
    id,
    playlist_id,
    name = 'Untitled Playlist',
    image = '/default-playlist.png',
    external_url = `https://open.spotify.com/playlist/${id || playlist_id || ''}`,
    tracks,
  } = playlist;

  const trackCount =
    typeof tracks === 'number' ? tracks : (playlist.track_count ?? '–');

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.02] bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md text-black dark:text-white',
        selectable && (isSelected ? 'border border-blue-500 bg-blue-50' : ''),
        className
      )}
    >
      <img
        src={image}
        alt={name}
        className="aspect-square w-14 object-cover rounded-md transition-shadow"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="font-bold leading-tight break-words line-clamp-2">
          {name}
        </p>
        {showTracks && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {typeof trackCount === 'number'
              ? `${trackCount} song${trackCount === 1 ? '' : 's'}`
              : 'None'}
          </p>
        )}
      </div>
    </motion.div>
  );

  return external_url && !onClick ? (
    <a href={external_url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

export default PlaylistCardMini;
