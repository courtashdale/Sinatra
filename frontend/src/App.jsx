// src/App.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import { applyRootThemeVars } from './utils/theme';

const Home = lazy(() => import('./pages/home.jsx'));
const Onboard = lazy(() => import('./pages/onboard.jsx'));
const Landing = lazy(() => import('./pages/landing.jsx'));
const PublicProfile = lazy(() => import('./pages/public.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));
const NotFound = lazy(() => import('./pages/404.jsx'));
const System = lazy(() => import('./pages/Status.jsx'));

function App() {
  useEffect(() => {
    const html = document.documentElement;
    const applyTheme = (theme) => {
      html.classList.toggle('dark', theme === 'dark');
      applyRootThemeVars(theme);
    };

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    const systemListener = window.matchMedia('(prefers-color-scheme: dark)');
    const systemThemeHandler = (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    systemListener.addEventListener('change', systemThemeHandler);
    return () =>
      systemListener.removeEventListener('change', systemThemeHandler);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-[var(--font)] transition-colors duration-300">
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/u/:user_id" element={<PublicProfile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/dev" element={<System />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
