import React from 'react';
import Score from './ui/Score';
import { Link } from 'react-router-dom';
import { CgGames } from "react-icons/cg";

const Header = () => {


  return (
    <>
      <header className="bg-background border-b border-red-600 rounded-full px-4 py-4 md:px-6 flex items-center justify-between">
        <Link to="/">
          <div className='flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate'>
            <CgGames className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
            <span className="text-xl sm:text-2xl font-bold">AI Playground</span>
          </div>
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Score />
        </div>

      </header>
    </>
  );
};

export default Header;
