import React from 'react';
import Score from './Score';
import { Link } from 'react-router-dom';

const Header = ({ score }) => {

  return (
    <>
      <header className="bg-background border-b border-red-600 rounded-full px-4 py-4 md:px-6 flex items-center justify-between">
    <Link to="/">
      <div className='flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent  animate-gradient-animate'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="w-12 h-12 text-orange-500"
      >
        <line x1="6" x2="10" y1="12" y2="12"></line>
        <line x1="8" x2="8" y1="10" y2="14"></line>
        <line x1="15" x2="15.01" y1="13" y2="13"></line>
        <line x1="18" x2="18.01" y1="11" y2="11"></line>
        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
      </svg>
      <span className="text-2xl font-bold">AI Playground</span>
      </div>
      </Link>
    <div className="flex items-center gap-4">
        <Score score={score} />
      <button className="inline-flex items-center justify-center text-white whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
        Leaderboard
      </button>
    </div>
  </header>
    </>
  );
};

export default Header;
