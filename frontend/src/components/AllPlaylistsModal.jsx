// src/components/AllPlaylistsModal.jsx
import React, { useEffect, useState } from 'react';
import { motion } from '@motionone/react';
import { apiGet } from '../utils/api';
import GlintBox from './GlintBox';
import PlaylistCardMini from './PlaylistCardMini';
import { normalizePlaylist } from '../utils/normalize';
import CloseButton from './ui/CloseButton';

function AllPlaylistsModal({ isOpen, onClose, playlists = [], user }) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsVisible(true);
    } else {
      timer = setTimeout(() => setIsVisible(false), 250);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const filteredPlaylists = playlists
  .map(normalizePlaylist)
  .filter((pl) =>
    pl.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
        }
        transition={{ duration: 0.25 }}
        className="modal-container max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col max-h-[90vh]"
      >
        <div className="p-4 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold mb-4 text-center">
            📚 {user?.display_name || 'Your'}'s Collection
          </h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playlists..."
            className="w-full mb-4 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-col gap-3">
            {filteredPlaylists.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                No playlists found.
              </p>
            ) : (
              [...filteredPlaylists]
                .sort((a, b) => (b.tracks || 0) - (a.tracks || 0))
                .map((p, i) => (
                  <PlaylistCardMini
                    key={p.id || p.playlist_id}
                    playlist={p}
                    index={i}
                    showTracks
                  />
                ))
            )}
          </div>
        </div>

        {/* Flush sticky footer */}
        <div className="border-t p-4 bg-white dark:bg-gray-800 rounded-b-lg">
          <CloseButton onClick={onClose} />
        </div>
      </motion.div>
    </div>
  );
}

export default AllPlaylistsModal;
