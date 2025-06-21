// src/components/steps/NameEditor.jsx
import React, { useState } from 'react';

function NameEditor({ user, onboardData, setOnboardData }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(
    onboardData.display_name || user?.display_name || ''
  );

  const handleChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    setOnboardData((prev) => ({ ...prev, display_name: newName }));
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h2 className="text-2xl font-semibold">
        We like the name "{user?.display_name || '...'}"!
      </h2>
      <h2 className="text-3xl font-bold">Do you?</h2>

      {!editing ? (
        <button
          className="text-blue-600 underline"
          onClick={() => setEditing(true)}
        >
          Nah, let's change it
        </button>
      ) : (
        <div className="w-full max-w-sm space-y-2">
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Enter your new display name"
            className="w-full p-2 border rounded-lg"
          />
          <p className="text-sm text-gray-500">
            This name will appear on your public profile.
          </p>
        </div>
      )}
    </div>
  );
}

export default NameEditor;
