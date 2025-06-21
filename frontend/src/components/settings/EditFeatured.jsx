// src/components/settings/EditFeatured.jsx
import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../../utils/api';
import GlintBox from '../GlintBox';
import PlaylistCardMini from '../PlaylistCardMini';
import CloseButton from '../ui/CloseButton';

function EditFeaturedModal({ isOpen, onClose, user_id, onSave, setUser }) {
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    apiGet(`/dashboard`)
      .then((data) => {
        setAllPlaylists(data.playlists.all);
        setSelected(data.playlists.featured.map((p) => p.id || p.playlist_id));
      })
      .catch((err) => {
        console.error('🔥 EditFeatured fetch failed:', err);
        setAllPlaylists([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen, user_id]);

  const handleToggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const handleSave = () => {
    if (!user_id) {
      console.error('❌ Cannot update featured: user_id is missing');
      return;
    }

    apiPost('/update-featured', {
      user_id,
      playlist_ids: selected,
    })
      .then(() => {
        setUser((prev) => ({
          ...prev,
          playlists: {
            ...prev.playlists,
            featured: allPlaylists.filter((p) => selected.includes(p.id)),
          },
        }));

        onSave();
        onClose();
      })
      .catch((err) => {
        console.error('❌ Failed to update featured playlists:', err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            🌟 Select 3 Playlists to Feature
          </h2>
          <input
            type="text"
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="p-4 overflow-y-auto flex-1 relative min-h-[200px]">
          <div className="grid grid-cols-2 gap-2">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-md border animate-pulse"
                  >
                    <GlintBox width="w-14" height="h-14" rounded="rounded-md" />
                    <div className="flex flex-col gap-2 flex-1">
                      <GlintBox width="w-3/4" height="h-4" />
                      <GlintBox width="w-1/2" height="h-3" />
                    </div>
                  </div>
                ))
              : allPlaylists
                  .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .sort((a, b) => (b.tracks || 0) - (a.tracks || 0))
                  .map((p) => (
                    <PlaylistCardMini
                      key={p.id}
                      playlist={p}
                      onClick={() => handleToggle(p.id)}
                      isSelected={selected.includes(p.id)}
                      selectable
                    />
                  ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800">
          <CloseButton onClick={onClose} className="flex-1" />
          <button
            onClick={handleSave}
            disabled={selected.length !== 3}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFeaturedModal;
