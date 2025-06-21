// src/components/animations/Songs.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SongsLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <DotLottieReact
        src="https://lottie.host/d274be46-a7e5-4404-ab5e-10d98daeb10b/EcoHvQmCdW.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default SongsLoading;
