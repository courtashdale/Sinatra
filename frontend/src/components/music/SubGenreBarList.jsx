// src/components/music/SubGenreBarList.jsx
import React from 'react';
import { motion } from '@motionone/react';

function SubGenreBarList({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-sm text-gray-400">No sub-genre data available.</div>
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
        const percent = portion.toFixed(1);
        const barWidth = `${portion}%`;
        const barGradient = gradient || 'linear-gradient(to right, #666, #999)';
        const delay = index * 0.08;

        return (
          <motion.div
            key={`subgenre-${name}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          >
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="italic">{name}</span>
              <span className="text-gray-400">{percent}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 0.6, delay }}
                className="h-full rounded-full"
                style={{ background: barGradient }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default SubGenreBarList;
