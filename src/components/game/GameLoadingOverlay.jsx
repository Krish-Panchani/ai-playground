import React from "react";

const GameLoadingOverlay = ({ title, subtitle }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="w-full max-w-md rounded-2xl border border-cyan-500/50 bg-slate-950 p-6 text-center shadow-2xl shadow-cyan-900/30">
      <div className="relative mx-auto mb-5 h-16 w-16">
        <div
          className="absolute inset-0 rounded-full border-4 border-slate-700/80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 game-loader-spin rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-500 animate-game-spin"
          aria-hidden="true"
        />
        <div
          className="absolute inset-2 game-loader-spin rounded-full border-2 border-transparent border-b-orange-400 animate-game-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.1s" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      {subtitle && <p className="mt-2 text-sm text-slate-300">{subtitle}</p>}
    </div>
  </div>
);

export default GameLoadingOverlay;
