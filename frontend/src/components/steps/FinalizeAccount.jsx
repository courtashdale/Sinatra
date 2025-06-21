// src/components/steps/FinalizeAccount.jsx
import React, { useEffect } from 'react';

function FinalizeAccount({ onboardData, setCanProceed }) {
  useEffect(() => setCanProceed(true), [setCanProceed]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">You're all set!</h2>
      <p className="text-gray-700">
        Here's a final look before we create your account:
      </p>

      <div className="flex items-center gap-4">
        <img
          src={onboardData.profile_picture}
          alt="Profile Preview"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="font-medium text-lg">{onboardData.display_name}</p>
          <p className="text-sm text-gray-500">
            {onboardData.featured_playlists.length} featured playlists
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mt-4">Selected Playlists:</h3>
        <ul className="list-disc ml-6 text-sm">
          {onboardData.selected_playlists.map((p) => (
            <li key={p.id}>
              {p.name} ({p.tracks} songs)
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium mt-4">Featured:</h3>
        <ul className="list-disc ml-6 text-sm text-green-700">
          {onboardData.featured_playlists.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FinalizeAccount;
