// src/components/steps/PlaylistImporter.jsx
import React, { useEffect, useState } from 'react';
import { apiPost, apiGet } from '../../utils/api';
import PlaylistCardMini from '../PlaylistCardMini';

function PlaylistImporter({
  user,
  onboardData,
  setOnboardData,
  setCanProceed,
}) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedIds, setSelectedIds] = useState(() =>
    Array.isArray(onboardData.selected_playlists)
      ? onboardData.selected_playlists.map((p) => p.playlist_id || p.id)
      : []
  );
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiPost(`/admin/sync_playlists?user_id=${user.id}`, {})
      .then(() => apiGet(`/user-playlists?user_id=${user.id}`))
      .then((res) => {
        const seen = new Set();
        const unique = res.playlists.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
        const sorted = unique.sort((a, b) => b.tracks - a.tracks);
        setPlaylists(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Playlist sync failed:', err);
        setLoading(false);
      });
  }, [user.id]);

  useEffect(() => {
    const selected = playlists.filter((p) => selectedIds.includes(p.id));
    setOnboardData((prev) => ({ ...prev, selected_playlists: selected }));
    setCanProceed(selected.length >= 3);
  }, [selectedIds, playlists]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSort = () => {
    setSortDesc((prev) => !prev);
    setPlaylists((prev) =>
      [...prev].sort((a, b) =>
        sortDesc ? a.tracks - b.tracks : b.tracks - a.tracks
      )
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === playlists.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(playlists.map((p) => p.id));
    }
  };

  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading your playlists...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Choose which playlists you like:
      </h2>
      <p className="text-sm text-gray-600">
        Don't worry, you can add/remove more later.
      </p>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={toggleSort}>Sort {sortDesc ? '↓' : '↑'}</button>
        <button onClick={toggleAll}>
          {selectedIds.length === playlists.length
            ? 'Deselect All'
            : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <PlaylistCardMini
            key={`${p.id}-${i}`}
            playlist={p}
            index={i}
            selectable
            isSelected={selectedIds.includes(p.id)}
            onClick={() => toggleSelect(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default PlaylistImporter;
