// src/pages/404.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">
        We couldn't find what you were looking for!
      </p>
      <Link
        to="/"
        className="text-sm px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition-all"
      >
        Return to Base
      </Link>
    </div>
  );
}
