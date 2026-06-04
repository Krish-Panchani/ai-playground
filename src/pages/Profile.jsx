import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SignInToPlay from "../components/auth/SignInToPlay";
import UserInfo from "../components/UserInfo";
import { api } from "../lib/api";
import { showError } from "../lib/toast";
import { APP_THEME, levelFromXp } from "../theme/theme";

const MODE_LABELS = {
  "creative-quest": "Creative Quest",
  guesswork: "Artful Guesswork",
  "story-builder": "Artful Stories",
};

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-center">
    <p className="text-2xl font-bold text-cyan-300">{value}</p>
    <p className="mt-1 text-sm font-semibold text-white">{label}</p>
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const statusClass = {
  active: "text-cyan-300",
  completed: "text-emerald-300",
  abandoned: "text-red-300",
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getMyProfile();
        setProfile(response.data);
      } catch (error) {
        showError(error, "Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const user = profile?.user;
  const stats = profile?.stats;
  const level = user?.level ?? levelFromXp(user?.xp || 0);
  const progress = user?.levelProgressPercent ?? 0;

  return (
    <SignInToPlay title="Sign in to view your profile">
      <div className={`flex flex-col gap-8 ${APP_THEME.page} p-4`}>
        <UserInfo isPage="Profile" />

        <div className="text-center">
          <h1 className={`text-4xl font-bold ${APP_THEME.heroGradient}`}>Your Profile</h1>
          <p className={`mt-2 ${APP_THEME.subtleText}`}>
            Track XP, level progress, adventures, and recent activity.
          </p>
        </div>

        {loading && (
          <p className={`text-center ${APP_THEME.subtleText}`}>Loading your profile...</p>
        )}

        {!loading && user && (
          <>
            <section className={`${APP_THEME.card} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-400">Player</p>
                <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
                {user.memberSince && (
                  <p className="mt-1 text-xs text-slate-500">
                    Member since {new Date(user.memberSince).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="min-w-[200px] text-right">
                <p className="text-lg font-bold text-orange-300">
                  Level {level} · {user.xp} XP
                </p>
                {profile.rank && (
                  <p className="text-sm text-slate-300">Leaderboard rank #{profile.rank}</p>
                )}
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {user.xpToNextLevel} XP to level {level + 1}
                </p>
              </div>
            </section>

            {stats && (
              <section>
                <h3 className="mb-3 text-lg font-bold text-white">Progress overview</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatCard label="Missions done" value={stats.missionsCompleted} />
                  <StatCard label="Adventures" value={stats.adventuresStarted} hint={`${stats.adventuresCompleted} completed`} />
                  <StatCard label="Drawings" value={stats.totalDrawings} />
                  <StatCard label="Stories" value={stats.storiesStarted} hint={`${stats.storiesCompleted} finished`} />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <StatCard label="Creative Quest" value={stats.creativeQuestDrawings} />
                  <StatCard label="Guesswork" value={stats.guessworkDrawings} />
                  <StatCard label="Story chapters" value={stats.storyDrawings} />
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">Adventure history</h3>
                <Link to="/CreativeQuest" className="text-sm text-cyan-300 underline">
                  Play Creative Quest
                </Link>
              </div>
              {profile.adventures?.length === 0 ? (
                <div className={`${APP_THEME.card} text-center text-slate-300`}>
                  No adventures yet. Start Creative Quest to begin your journey.
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.adventures.map((adventure) => (
                    <article key={adventure.sessionId} className={APP_THEME.stripCard}>
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{adventure.worldName}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(adventure.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className={`font-bold uppercase ${statusClass[adventure.status] || "text-slate-300"}`}>
                            {adventure.status}
                          </p>
                          <p className="text-orange-300">
                            {adventure.completedCount} done · +{adventure.totalXp} XP
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {adventure.missions?.slice(-5).map((mission) => (
                          <span
                            key={mission.chapterNumber}
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              mission.status === "completed"
                                ? "bg-emerald-900/50 text-emerald-200"
                                : mission.status === "failed"
                                  ? "bg-red-900/50 text-red-200"
                                  : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            Ch {mission.chapterNumber}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="mb-3 text-lg font-bold text-white">Recent activity</h3>
              {profile.recentDrawings?.length === 0 ? (
                <div className={`${APP_THEME.card} text-center text-slate-300`}>
                  No drawings yet. Play a game mode to create your first masterpiece.
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.recentDrawings.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-cyan-300">
                          {MODE_LABELS[item.mode] || item.mode}
                        </p>
                        <p className="line-clamp-2 text-sm text-slate-200">{item.summary}</p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        {item.finalScore > 0 && (
                          <p className="text-emerald-300">Score {item.finalScore}</p>
                        )}
                        {item.xpEarned > 0 && <p className="text-orange-300">+{item.xpEarned} XP</p>}
                        <p>{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {profile.stories?.length > 0 && (
              <section>
                <h3 className="mb-3 text-lg font-bold text-white">Stories</h3>
                <div className="space-y-2">
                  {profile.stories.map((story) => (
                    <div
                      key={story.id}
                      className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3"
                    >
                      <p className="font-semibold text-white">{story.title}</p>
                      <p className="text-sm text-slate-300">
                        {story.chapterCount} chapters
                        {story.isCompleted ? " · Complete" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-wrap justify-center gap-4 pb-8">
              <Link
                to="/Leaderboard"
                className={`px-6 py-3 ${APP_THEME.secondaryButton}`}
              >
                Leaderboard
              </Link>
              <Link to="/ArtGallery" className={`px-6 py-3 ${APP_THEME.secondaryButton}`}>
                Art Gallery
              </Link>
            </div>
          </>
        )}
      </div>
    </SignInToPlay>
  );
}

export default ProfilePage;
