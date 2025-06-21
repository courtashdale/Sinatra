// src/components/OnboardingSteps.jsx
import React, { useEffect } from 'react';
import { motion } from '@motionone/react';
import NameEditor from './steps/NameEditor';
import PictureEditor from './steps/PictureEditor';
import PlaylistImporter from './steps/PlaylistImporter';
import FeaturedPicker from './steps/FeaturedPicker';
import Loader from '../components/Loader';

const totalSteps = 4;

function OnboardingSteps({
  step,
  user,
  onboardData,
  setOnboardData,
  setCanProceed,
}) {
  const sharedProps = { user, onboardData, setOnboardData, setCanProceed };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <NameEditor {...sharedProps} />;
      case 1:
        return <PictureEditor {...sharedProps} />;
      case 2:
        return <PlaylistImporter {...sharedProps} />;
      case 3:
        return <FeaturedPicker {...sharedProps} />;
      case 4:
        return <Loader />;
      default:
        return <div className="text-center text-red-600">Invalid step</div>;
    }
  };

  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="onboard-wrapper">
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="onboard-step-content">{renderStep()}</div>
    </div>
  );
}

export default OnboardingSteps;
