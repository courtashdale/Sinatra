// src/components/music/GenreBarList.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from '@motionone/react';

function GenreBarList({ data, baseDelay = 0.4 }) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Once the component has mounted the first time, disable base delay
    const timer = setTimeout(() => {
      hasAnimated.current = true;
    }, 500); // enough to finish initial animation
    return () => clearTimeout(timer);
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-sm text-gray-400">No genre data available.</div>
    );
  }

  const total =
    data.reduce((sum, d) => (isFinite(d.value) ? sum + d.value : sum), 0) || 1;

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 transition-colors duration-300 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {data.map((genre, index) => {
        const { name, value, gradient } = genre;
        if (!isFinite(value)) return null;

        const portion = (value / total) * 100;
        const displayPercent = portion.toFixed(1);
        const barWidth = `${portion}%`;

        const delay = (hasAnimated.current ? 0 : baseDelay) + index * 0.1;

        return (
          <motion.div
            key={`genre-${name}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          >
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>{name}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {displayPercent}%
              </span>
            </div>
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.6, delay }}
                className="h-full rounded-full"
                style={{ background: gradient || '#ccc' }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default GenreBarList;
