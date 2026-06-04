import React from "react";
import { Link } from "react-router-dom";
import { CgGames } from "react-icons/cg";

import Score from "./ui/Score";
import useAuth from "../hooks/useAuth";
import { APP_THEME } from "../theme/theme";

const Header = () => {
  const user = useAuth();

  return (
    <header className="rounded-full border border-red-600/70 bg-slate-950 px-4 py-4 md:px-6 flex items-center justify-between shadow-lg gap-4">
      <Link to="/">
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient-animate">
          <CgGames className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
          <span className="text-xl sm:text-2xl font-bold">AI Playground</span>
        </div>
      </Link>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {user && (
          <Link
            to="/Profile"
            className={`text-sm font-semibold px-4 py-2 rounded-full ${APP_THEME.secondaryButton}`}
          >
            Profile
          </Link>
        )}
        <Score />
      </div>
    </header>
  );
};

export default Header;
