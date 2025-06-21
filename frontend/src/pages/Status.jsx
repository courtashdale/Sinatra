// src/pages/Status.jsx
import React, { useEffect, useState } from 'react';
import { motion } from '@motionone/react';

function Status() {
  const [status, setStatus] = useState({});
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = async () => {
    const result = {};
    const timestamp = new Date().toLocaleTimeString();
    // Vercel Status
    try {
      const res = await fetch(
        'https://sinatra-hwmgf29rs-courtimusprimes-projects.vercel.app'
      );
      const data = await res.json();

      if (data.vercel === 'READY') {
        result.frontend = `🟢 Deployed`;
      } else if (data.vercel === 'BUILDING') {
        result.frontend = `🟡 Building`;
      } else {
        result.frontend = `🔴 ${data.vercel || 'Unknown'}`;
      }
    } catch {
      result.frontend = '🔴 Error';
    }

    // Railway backend and Mongo
    try {
      const res = await fetch(
        'https://web-production-54720.up.railway.app/status'
      );
      const data = await res.json();
      result.backend = '🟢 Online';
      result.mongo = data.mongo === 'online' ? '🟢 Online' : '🔴 Offline';
    } catch {
      result.backend = '🔴 Offline';
      result.mongo = '🔴 Offline';
    }

    // Namecheap – no public API
    result.domain = '🟡 Check';

    setStatus(result);
    setLastChecked(timestamp);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // every 60s
    return () => clearInterval(interval);
  }, []);

  const entries = [
    {
      label: 'Frontend (Vercel)',
      key: 'frontend',
      link: 'https://vercel.com/courtimusprimes-projects/sinatra',
    },
    {
      label: 'Backend (Railway)',
      key: 'backend',
      link: 'https://railway.com/project/b21e0d38-5dd0-462e-ab1a-d1847bd7e0f3?environmentId=8c33db78-7c95-4991-91e0-9340e93f5b93',
    },
    { label: 'MongoDB', key: 'mongo' }, // no link
    {
      label: 'Domain (Namecheap)',
      key: 'domain',
      link: 'https://ap.www.namecheap.com/domains/domaincontrolpanel/sinatra.live/domain',
    },
  ];

  return (
    <motion.div
      className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        📋 Sinatra App Status
      </h1>
      <ul className="space-y-4 text-lg">
        {entries.map(({ label, key, link }) => (
          <li key={key} className="flex items-center justify-between">
            <div>
              <span>{label}</span>
              <span className="ml-2 font-mono">{status[key] || '...'}</span>
            </div>
            {link && (
              <button
                onClick={() => window.open(link, '_blank')}
                className="ml-4 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Open
              </button>
            )}
          </li>
        ))}
      </ul>
      <p className="text-sm text-right mt-6 text-gray-500">
        Last checked: {lastChecked || 'loading...'}
      </p>
    </motion.div>
  );
}

export default Status;
