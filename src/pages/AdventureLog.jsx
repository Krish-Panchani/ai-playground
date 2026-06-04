import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SignInToPlay from "../components/auth/SignInToPlay";
import UserInfo from "../components/UserInfo";
import { api } from "../lib/api";
import { showError } from "../lib/toast";
import { APP_THEME } from "../theme/theme";

const statusStyles = {
  active: "text-cyan-300",
  completed: "text-emerald-300",
  abandoned: "text-red-300",
};

function AdventureLogContent() {
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getMyAdventures();
        setAdventures(response.data || []);
      } catch (err) {
        showError(err, "Could not load your adventure log. Please try again.");
        setError(err.friendlyMessage || err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${APP_THEME.heroGradient}`}>Adventure Log</h1>
        <p className={`mt-2 ${APP_THEME.subtleText}`}>Review completed missions, scores, and XP from your quests.</p>
      </div>

      {loading && <p className={`text-center ${APP_THEME.subtleText}`}>Loading adventures...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && adventures.length === 0 && (
        <div className={`${APP_THEME.card} text-center`}>
          <p className="text-white">No adventures yet.</p>
          <Link to="/CreativeQuest" className="mt-4 inline-block text-cyan-300 underline">
            Start your first quest
          </Link>
        </div>
      )}

      {adventures.map((adventure) => (
        <article key={adventure.sessionId} className={APP_THEME.card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">{adventure.worldName || "Creative Quest"}</h2>
              <p className={`text-sm ${APP_THEME.subtleText}`}>
                {new Date(adventure.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold uppercase ${statusStyles[adventure.status] || "text-slate-300"}`}>
                {adventure.status}
              </p>
              <p className="text-sm text-orange-300">
                {adventure.completedCount} completed · {adventure.totalXp} XP
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {adventure.missions?.map((mission) => (
              <div
                key={`${adventure.sessionId}-${mission.chapterNumber}`}
                className="rounded-xl border border-slate-700 bg-slate-900/80 p-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold text-cyan-200">
                    Ch {mission.chapterNumber}: {mission.chapterTitle}
                  </p>
                  <span
                    className={`text-xs font-bold uppercase ${
                      mission.status === "completed"
                        ? "text-emerald-300"
                        : mission.status === "failed"
                          ? "text-red-300"
                          : "text-amber-200"
                    }`}
                  >
                    {mission.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-200">{mission.missionPrompt}</p>
                {mission.status === "completed" && (
                  <p className="mt-2 text-xs text-emerald-300">
                    Score {mission.score} · +{mission.xpEarned} XP
                  </p>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </>
  );
}

function AdventureLog() {
  return (
    <SignInToPlay title="Sign in to view your log">
      <div className={`flex flex-col gap-6 ${APP_THEME.page} p-4`}>
        <UserInfo isPage="AdventureLog" />
        <AdventureLogContent />
      </div>
    </SignInToPlay>
  );
}

export default AdventureLog;
