// src/components/music/MusicTaste.jsx
import { useEffect, useState, useMemo, useRef } from 'react';
import { apiGet } from '../../utils/api';
import GenreBarList from './GenreBarList';
import SubGenreBarList from './SubGenreBarList';
import { useSwipeable } from 'react-swipeable';

function MusicTaste({ genresData: initialGenresData, userId }) {
  const cached =
    !initialGenresData && userId
      ? localStorage.getItem(`genreData:${userId}`)
      : null;
  
      const [genresData, setGenresData] = useState(() => {
        if (initialGenresData) return initialGenresData;
        if (cached) {
          try {
            return JSON.parse(cached);
          } catch {
            return null;
          }
        }
        return null;
      });
  const [ loading, setLoading ] = useState(!initialGenresData && !cached);
  const [step, setStep] = useState(0);
  const hasShownGenresOnce = useRef(false);

  useEffect(() => {
    if (userId) {
      const cachedData = localStorage.getItem(`genreData:${userId}`);
      if (!initialGenresData && cachedData) {
        try {
          setGenresData(JSON.parse(cachedData));
          setLoading(false);
          return;
        } catch {
          /* ignore parse errors */
        }
      }
    }
    if (!genresData) {
      const endpoint = userId ? `/public-genres/${userId}` : `/genres`;

      apiGet(endpoint)
        .then((res) => {
          setGenresData(res);
          if (userId) {
            localStorage.setItem(`genreData:${userId}`, JSON.stringify(res));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch genres:', err);
          setLoading(false);
        });
    }
  }, [userId]);

  const metaGenres = useMemo(() => {
    if (!genresData?.meta_genres) return [];
    return Object.entries(genresData.meta_genres)
      .sort((a, b) => b[1].portion - a[1].portion)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        value: Math.round(data.portion * 10) / 10,
        gradient: data.gradient,
      }));
  }, [genresData]);

  const shouldDelayGenres = !hasShownGenresOnce.current && step === 0;
  useEffect(() => {
    if (step === 0) hasShownGenresOnce.current = true;
  }, [step]);

  const subGenres = useMemo(() => {
    if (!genresData?.sub_genres) return [];
    return Object.entries(genresData.sub_genres)
      .sort((a, b) => b[1].portion - a[1].portion)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        value: data.portion,
        gradient: data.gradient || 'linear-gradient(to right, #666, #999)',
      }));
  }, [genresData]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setStep((prev) => Math.min(prev + 1, 1)),
    onSwipedRight: () => setStep((prev) => Math.max(prev - 1, 0)),
    trackTouch: true,
    trackMouse: true,
  });

  const currentData = step === 0 ? metaGenres : subGenres;
  const title = step === 0 ? '🎸 Top Genres' : '🧩 Top Sub-genres';

  return (
    <div
      {...handlers}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 transition-colors duration-300"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {loading ? (
        <div className="text-sm text-gray-400">Loading genre data...</div>
      ) : !currentData.length ? (
        <div className="text-sm text-gray-400">No genre data available.</div>
      ) : step === 0 ? (
        <GenreBarList
          data={metaGenres}
          baseDelay={shouldDelayGenres ? 0.4 : 0}
        />
      ) : (
        <SubGenreBarList data={subGenres} />
      )}
      <div className="flex justify-center gap-2 mt-4">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === step
                ? 'bg-gray-800 dark:bg-white scale-110'
                : 'bg-gray-300 dark:bg-gray-600 scale-90'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default MusicTaste;
