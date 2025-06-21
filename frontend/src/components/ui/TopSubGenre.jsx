// src/components/ui/TopSubGenre.jsx
import React from 'react';

function TopSubGenre({ topGenre }) {
  if (!topGenre?.sub_genre) return null;

  const { sub_genre, gradient } = topGenre;

  return (
    <div className="text-sm text-gray-500 text-center">
      Current taste:{' '}
      <span
        className="font-semibold bg-clip-text text-transparent"
        style={{
          backgroundImage: gradient || 'linear-gradient(to right, #666, #999)',
        }}
      >
        {sub_genre}
      </span>
    </div>
  );
}

export default TopSubGenre;
