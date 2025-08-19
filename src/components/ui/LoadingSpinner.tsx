import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-500 from-10% via-indigo-500 to-sky-500 to-100%'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white'></div>
        <p className='mt-4 text-white text-xl font-semibold'>Chargement...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
