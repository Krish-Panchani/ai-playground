import React from "react";

import Login from "../Login";
import GameLoadingOverlay from "../game/GameLoadingOverlay";
import { useAuthContext } from "../../context/AuthContext";
import { APP_THEME } from "../../theme/theme";

const SignInToPlay = ({ children, title = "Sign in to play", subtitle }) => {
  const { loading, isAuthenticated } = useAuthContext();

  if (loading) {
    return <GameLoadingOverlay title="Checking your account..." subtitle="One moment." />;
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 ${APP_THEME.page}`}>
        <div className={`w-full max-w-lg text-center ${APP_THEME.card}`}>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">AI Playground</p>
          <h1 className={`mt-3 text-3xl sm:text-4xl font-bold ${APP_THEME.heroGradient}`}>{title}</h1>
          <p className={`mt-4 text-base ${APP_THEME.subtleText}`}>
            {subtitle ||
              "Create an account with Google to save XP, appear on the leaderboard, and unlock all game modes."}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Login />
            <p className={`text-xs ${APP_THEME.subtleText}`}>Free · Family friendly · Progress saved to your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default SignInToPlay;
