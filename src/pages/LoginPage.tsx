import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseAuthModal } from '../components/SupabaseAuthModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
      <SupabaseAuthModal
        isOpen={true}
        onClose={() => navigate('/')}
        initialMode="signin"
      />
    </div>
  );
};
