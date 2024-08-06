import React from 'react';
import Score from './ui/Score';
import { Link } from 'react-router-dom';
import { CgGames } from "react-icons/cg";

const Header = ({ score }) => {
  

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
          <Score score={score} />
          {/* <button className="inline-flex items-center justify-center text-white whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
            Leaderboard
          </button> */}
          
        </div>
        
      </header>
    </>
  );
};

export default Header;
