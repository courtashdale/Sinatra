// src/components/settings/EditPlaylists.jsx
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../utils/api';
import { motion } from '@motionone/react';
import '../../styles/loader.css';
import GlintBox from '../GlintBox';
import PlaylistCardMini from '../PlaylistCardMini';
import { normalizePlaylist } from '../../utils/normalize';
import CloseButton from '../ui/CloseButton';
import { useUser } from '../../context/UserContext';

function EditPlaylistsModal({ isOpen, onClose }) {
  const { user_id } = useUser();
  const [tab, setTab] = useState('add');
  const [allSpotifyPlaylists, setAllSpotifyPlaylists] = useState([]);
  const [importedPlaylists, setImportedPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [paginatedOffset, setPaginatedOffset] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(null);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call sync to fetch new playlists from Spotify
      await apiPost(`/admin/sync_playlists?user_id=${user_id}`, {});

      // Reset playlist state
      setAllSpotifyPlaylists([]);
      setPaginatedOffset(0);

      // Refetch the updated synced playlists from MongoDB
      const res = await apiGet(
        `/synced-playlists/paginated?user_id=${user_id}&offset=0&limit=50`
      );
      const newPlaylists = Array.isArray(res.playlists)
        ? res.playlists.map(normalizePlaylist)
        : [];
      setAllSpotifyPlaylists(newPlaylists);
      setTotalAvailable(res.total);
      setPaginatedOffset(50);
    } catch (err) {
      console.error('❌ Refresh failed', err);
      setError('Failed to refresh playlists.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePlaylists = async () => {
    try {
      const res = await apiGet(
        `/synced-playlists/paginated?user_id=${user_id}&offset=${paginatedOffset}&limit=50`
      );
      const newPlaylists = Array.isArray(res.playlists)
        ? res.playlists.map(normalizePlaylist)
        : [];
      setAllSpotifyPlaylists((prev) => [...prev, ...newPlaylists]);
      setPaginatedOffset((prev) => prev + 50);
      setTotalAvailable(res.total);
    } catch (err) {
      console.error('❌ Failed to load more playlists', err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setAllSpotifyPlaylists([]);
    setPaginatedOffset(0);
    setSearch('');
    setSelectedIds([]);
    setError(null);
    loadMorePlaylists();
    apiGet('/dashboard')
      .then((res) => {
        const mongoPlaylistsRaw = Array.isArray(res.playlists?.all)
          ? res.playlists.all
          : [];
        const imported = mongoPlaylistsRaw.map(normalizePlaylist);
        setImportedPlaylists(imported);
      })
      .catch(() => setImportedPlaylists([]));
  }, [isOpen, user_id]);

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      const targetPlaylists =
        tab === 'add'
          ? allSpotifyPlaylists.filter((p) => selectedIds.includes(p.playlist_id || p.id))
          : importedPlaylists.filter((p) => selectedIds.includes(p.playlist_id || p.id));

      const payload = targetPlaylists.map((p) => ({ id: p.playlist_id || p.id }));
      const endpoint = tab === 'add' ? '/add-playlists' : '/delete-playlists';

      console.log("📤 Submitting:", {
        endpoint,
        playlists: payload,
      });

      await apiPost(endpoint, { playlists: payload }); // ✅ no user_id here
      onClose();
    } catch (err) {
      console.error('❌ Save failed:', err);
      setError('Failed to save your changes.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const importedIds = new Set(importedPlaylists.map((p) => p.playlist_id || p.id));

  const displayedPlaylists =
    tab === 'add'
      ? allSpotifyPlaylists.filter((p) => !importedIds.has(p.playlist_id || p.id))
      : importedPlaylists;

  const filteredPlaylists = displayedPlaylists
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortDesc ? (b.tracks || 0) - (a.tracks || 0) : (a.tracks || 0) - (b.tracks || 0)
    );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4 space-y-2">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setTab('add')}
              className={`flex-1 py-2 rounded font-bold text-sm ${
                tab === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              ➕ Add Playlists
            </button>
            <button
              onClick={() => setTab('remove')}
              className={`flex-1 py-2 rounded font-bold text-sm ${
                tab === 'remove'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white'
              }`}
            >
              🗑️ Remove Playlists
            </button>
          </div>

          {tab === 'add' && (
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Search playlists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSortDesc((prev) => !prev)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-sm"
              >
                Sort {sortDesc ? '↓' : '↑'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-2 rounded bg-blue-100 dark:bg-blue-700 text-sm text-blue-800 dark:text-white"
              >
                🔄 Refresh
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-24">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 cursor-pointer bg-white dark:bg-gray-900 p-2 rounded-md animate-pulse border"
              >
                <GlintBox width="w-14" height="h-14" rounded="rounded-md" />
                <div className="flex flex-col gap-2 flex-1">
                  <GlintBox width="w-3/4" height="h-4" />
                  <GlintBox width="w-1/2" height="h-3" />
                </div>
              </div>
            ))
          ) : filteredPlaylists.length === 0 ? (
            <p className="text-sm text-center col-span-2 text-gray-400">
              No matching playlists.
            </p>
          ) : (
            filteredPlaylists.map((p, i) => {
              const id = p.playlist_id || p.id;
              return (
                <PlaylistCardMini
                  key={id}
                  playlist={p}
                  index={i}
                  onClick={() =>
                    setSelectedIds((prev) =>
                      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                    )
                  }
                  isSelected={selectedIds.includes(id)}
                  selectable
                  showTracks
                />
              );
            })
          )}
        </div>

        {tab === 'add' && !search && allSpotifyPlaylists.length < totalAvailable && (
          <button
            onClick={loadMorePlaylists}
            className="mt-4 w-full px-4 py-2 text-sm rounded bg-gray-100 dark:bg-gray-700"
          >
            Load More ({allSpotifyPlaylists.length}/{totalAvailable})
          </button>
        )}

        <div className="sticky bottom-0 left-0 bg-white dark:bg-gray-800 border-t mt-4 pt-3 pb-4 px-6 flex gap-2 z-10">
          <CloseButton onClick={onClose} className="flex-1" />
          <button
            onClick={handleSave}
            disabled={loading || selectedIds.length === 0}
            className={`flex-1 px-4 py-2 rounded text-white ${
              tab === 'add' ? 'bg-green-500' : 'bg-red-500'
            } ${loading ? 'opacity-50 cursor-wait' : ''}`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default EditPlaylistsModal;