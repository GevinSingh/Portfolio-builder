import React from 'react';
import { BuildFromScratchWizard } from '../components/BuildFromScratchWizard';

export const BuildFromScratchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <BuildFromScratchWizard isModal={false} />
    </div>
  );
};

export default BuildFromScratchPage;
