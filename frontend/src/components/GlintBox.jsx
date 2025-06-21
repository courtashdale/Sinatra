// src/components/GlintBox.jsx
import React from 'react';

export default function GlintBox({
  width = 'w-full',
  height = 'h-6',
  rounded = 'rounded-md',
  className = '',
}) {
  return (
    <div
      className={`${width} ${height} ${rounded} ${className}
        bg-[linear-gradient(90deg,#e0e0e0_0%,#f8f8f8_50%,#e0e0e0_100%)]
        dark:bg-[linear-gradient(90deg,#2c2c2c_0%,#3a3a3a_50%,#2c2c2c_100%)]
        bg-[length:300%_100%] bg-[position:-200%_0] animate-[shimmer_2.5s_infinite_linear]`}
    />
  );
}
