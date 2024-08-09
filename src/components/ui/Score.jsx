import React from 'react';
import { useUserScore } from '../../hooks/UserScoreContext';

const Score = () => {
  const { score } = useUserScore();
  return (
  <>
    <div className='bg-gradient-to-r from-red-500 to-orange-500  px-4 py-1 sm:py-2 rounded-full'>
      <h2 className='text-lg text-center text-white'><span className='font-bold text-xl '>{score}</span> Points</h2>
    </div>
  </>
  );
};

export default Score;