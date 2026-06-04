import React from "react";

const MissionHUD = ({
  mission,
  timeLeft,
  score,
  level,
  completedChapters,
  totalChapters = 10,
  missionState,
}) => {
  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;
  const timeText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progress = Math.min(100, Math.round((completedChapters / totalChapters) * 100));
  const timerUrgent = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className="rounded-2xl border border-cyan-600/40 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-300/80">Current World</p>
          <p className="text-lg font-bold text-white">{mission?.missionTheme || "Adventure"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-orange-300/80">Player</p>
          <p className="text-lg font-bold text-white">
            {score} XP · Lv {level}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-300">
          <span>Adventure Progress</span>
          <span>
            {completedChapters}/{totalChapters} chapters
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            timerUrgent ? "bg-red-600/30 text-red-200" : "bg-cyan-700/30 text-cyan-100"
          }`}
        >
          ⏱ {missionState === "in_mission" ? timeText : "Paused"}
        </span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
          Chapter {mission?.chapterNumber || 1}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            missionState === "submitted"
              ? "bg-emerald-700/40 text-emerald-200"
              : missionState === "expired"
                ? "bg-red-700/40 text-red-200"
                : "bg-amber-700/40 text-amber-100"
          }`}
        >
          {missionState === "submitted"
            ? "Scored"
            : missionState === "expired"
              ? "Time Up"
              : missionState === "in_mission"
                ? "In Progress"
                : "Ready"}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-orange-500/30 bg-black/40 p-4">
        <p className="text-sm font-semibold text-orange-300">{mission?.chapterTitle}</p>
        <p className="mt-2 text-base text-white">{mission?.missionPrompt}</p>
      </div>
    </div>
  );
};

export default MissionHUD;
