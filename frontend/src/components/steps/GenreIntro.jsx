// src/components/steps/GenreIntro.jsx
import React, { useEffect, useState } from 'react';
import { motion } from '@motionone/react';

function GenreIntro({ genres, setCanProceed }) {
  const [showSubGenres, setShowSubGenres] = useState(false);
  const [showOutro, setShowOutro] = useState(false);

  useEffect(() => {
    setCanProceed(true);
    const t1 = setTimeout(() => setShowSubGenres(true), 3000);
    const t2 = setTimeout(() => setShowOutro(true), 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const highestObj = genres?.highest || {};
  const subGenresObj = genres?.sub_genres || {};

  const topMetaGenres = Object.entries(highestObj)
    .sort((a, b) => {
      const aVal = typeof a[1] === 'object' ? a[1].portion : a[1];
      const bVal = typeof b[1] === 'object' ? b[1].portion : b[1];
      return bVal - aVal;
    })
    .slice(0, 5)
    .map(([genre]) => genre);

  const topSubGenres = Object.entries(subGenresObj)
    .sort((a, b) => {
      const aVal = typeof a[1] === 'object' ? a[1].portion : a[1];
      const bVal = typeof b[1] === 'object' ? b[1].portion : b[1];
      return bVal - aVal;
    })
    .slice(0, 5)
    .map(([genre]) => genre);

  return (
    <div className="space-y-10 text-center">
      <motion.div
        key="meta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-2">Welcome to Sinatra 👋</h2>
        <p className="text-gray-700 mb-4">
          Based on your Spotify data, your top musical styles are:
        </p>
        <ul className="list-disc ml-6 text-left inline-block">
          {topMetaGenres.map((genre, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {genre}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {showSubGenres && (
        <motion.div
          key="sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2">You’re also into...</h2>
          <p className="text-gray-700 mb-4">
            Here are your most played sub-genres lately:
          </p>
          <ul className="list-disc ml-6 text-left inline-block">
            {topSubGenres.map((sub, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {sub}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {showOutro && (
        <motion.div
          key="outro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-2">
            But music is much more than just genres.
          </h2>
          <p className="text-gray-700 mt-2">
            With Sinatra, you'll be able to share the <strong>tracks</strong>{' '}
            and <strong>playlists</strong> that makes your music taste{' '}
            <strong>uniquely yours</strong>!
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default GenreIntro;
