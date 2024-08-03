import React from 'react';
import Score from './Score';

const Header = ({score}) => {
  
  return (
    <div className='flex justify-between items-center px-4 py-4 rounded-full border-2 border-cyan-400'>
      <h1 className='text-xl sm:text-3xl font-bold border-l-4 border-gray-800 pl-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>AI PLAYGROUND</h1>
      <Score score={score}/>
    </div>
  );
};

export default Header;
