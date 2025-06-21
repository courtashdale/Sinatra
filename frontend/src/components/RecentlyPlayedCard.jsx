// frontend/src/components/RecentlyPlayedCard.jsx
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from '@motionone/react';
import { getMetaGenreFromList, getMetaGradients } from '../utils/genreUtils';

function cleanTrackName(name) {
  return name
    .replace(/\s*[-–]\s*\d{4}\s*Remaster(ed)?/i, '')
    .replace(/\s*[-–]\s*Remaster(ed)?( Version)?/i, '')
    .replace(/\s*\(\s*\d{4}\s*Remaster\s*\)/i, '')
    .replace(/\s*\(\s*Remaster(ed)?\s*\)/i, '')
    .replace(/\s*\[\s*\d{4}\s*Remaster\s*\]/i, '')
    .replace(/\s*[-–]\s*Single( Version| Edit)?/i, '')
    .replace(/\s*\(\s*Single( Version| Edit)?\s*\)/i, '')
    .replace(/\s*[-–]\s*Single;\s*\d{4}\s*Remaster/i, '')
    .replace(/\s*[-–]\s*\d{4}$/i, '')
    .trim();
}

function RecentlyPlayedCard({
  track,
  lastUpdated,
  isRefreshing,
  animateTrackChange,
  onRefresh,
}) {
  const [gradients, setGradients] = useState(null);

  useEffect(() => {
    getMetaGradients().then(setGradients);
  }, []);

  if (!track) return <div className="text-gray-400"></div>;

  const getFreshnessLabel = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin === 1) return '1m ago';
    return `${diffMin}m ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative rounded-2xl overflow-hidden text-white shadow-md w-full mt-6 transition-colors duration-300 ${animateTrackChange ? 'animate-bgfade' : ''}`}
      style={{
        backgroundImage: track.album_art_url
          ? `url(${track.album_art_url})`
          : undefined,
        backgroundColor: !track.album_art_url
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '#111827'
            : '#ffffff'
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '140px',
        willChange: 'opacity, transform',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm" />

      <div className="relative z-10 p-4 flex flex-col gap-2 text-white dark:text-white">
        <h2 className="text-lg sm:text-base font-semibold flex items-center gap-2">
          🎧 Recently Played
          {lastUpdated && (
            <span className="text-xs text-gray-300 font-normal">
              ({getFreshnessLabel(lastUpdated)})
            </span>
          )}
        </h2>

        <div className="mt-2">
          <p
            className={`text-xl font-bold leading-tight ${animateTrackChange ? 'animate-fadein-fast' : ''}`}
            title={track.name}
          >
            {cleanTrackName(track.name)}
          </p>
          <p
            className={`text-sm text-gray-200 ${animateTrackChange ? 'animate-fadein-slow' : ''}`}
          >
            {track.artist}
          </p>

          {track.genres?.length > 0 &&
            (() => {
              const first = track.genres[0];
              const isObject = first && typeof first === 'object';
              const label = isObject ? first.name : first;
              const gradient = isObject
                ? first.gradient || gradients?.[first.name]
                : gradients?.[getMetaGenreFromList(track.genres)];
              if (!gradients) return null;
              return (
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white shadow mt-1"
                  style={{ background: gradient }}
                >
                  {label}
                </span>
              );
            })()}
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-20">
        <button
          onClick={onRefresh}
          className={`text-white hover:text-gray-300 transition-colors ${
            isRefreshing ? 'animate-spin-once' : ''
          }`}
          aria-label="Refresh"
        >
          <RefreshCcw size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default RecentlyPlayedCard;
