import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImageHelper';

function ProfileImageEditor({
  initialImage,
  onSave,
  onCancel,
  presetAvatars = [],
}) {
  const [image, setImage] = useState(initialImage || '');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleSave = async () => {
    const blob = await getCroppedImg(image, croppedAreaPixels);
    onSave(blob);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-4">
      {image && (
        <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
          <button onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>

      {presetAvatars.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {presetAvatars.map((url, idx) => (
            <img
              key={idx}
              src={url}
              className="w-16 h-16 object-cover rounded-full border hover:ring cursor-pointer"
              onClick={() => setImage(url)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileImageEditor;
