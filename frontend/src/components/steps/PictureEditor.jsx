// src/components/steps/PictureEditor.jsx
import React, { useState, useEffect } from 'react';

function PictureEditor({ user, onboardData, setOnboardData, setCanProceed }) {
  const [image, setImage] = useState(
    onboardData.profile_picture || user?.images?.[1]?.url || ''
  );
  const [original, setOriginal] = useState(user?.images?.[1]?.url || '');

  useEffect(() => {
    setCanProceed(true);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setOnboardData((prev) => ({ ...prev, profile_picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const revertImage = () => {
    setImage(original);
    setOnboardData((prev) => ({ ...prev, profile_picture: original }));
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-semibold">Hey good lookin' 👀</h2>
        <img
          src={image}
          alt="Profile Preview"
          className="w-24 h-24 rounded-full object-cover border mx-auto"
        />
        <p className="text-gray-700">Is this how you want people to see you?</p>
        <div className="space-y-2">
          <button
            className="text-blue-600 underline"
            onClick={() => document.getElementById('file-input').click()}
          >
            Yeah let's change it 🤮
          </button>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>
    </div>
  );
}

export default PictureEditor;
