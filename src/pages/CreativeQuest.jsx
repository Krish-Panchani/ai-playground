import React, { useEffect, useMemo, useRef, useState } from "react";

import AIResponse from "../components/AIResponse";
import DrawingCanvas from "../components/DrawingCanvas";
import GameLoadingOverlay from "../components/game/GameLoadingOverlay";
import MissionHUD from "../components/game/MissionHUD";
import HowPlay from "../components/ui/howPlay";
import SignInToPlay from "../components/auth/SignInToPlay";
import UserInfo from "../components/UserInfo";
import { handleDrawingComplete, handleSendPrompt } from "../helpers/handleQuestDrawing";
import useAge from "../hooks/useAge";
import useAuth from "../hooks/useAuth";
import useSkill from "../hooks/useSkill";
import { useAuthContext } from "../context/AuthContext";
import { useUserScore } from "../hooks/UserScoreContext";
import { api } from "../lib/api";
import { showError, showInfo, showSuccess } from "../lib/toast";
import { APP_THEME, levelFromXp } from "../theme/theme";

const ACTIVE_SESSION_KEY = "ai-playground-active-session";
const TOTAL_CHAPTERS = 10;
const WORLD_STRIP = [
  "Forest of Beginnings",
  "Crystal Caves",
  "Ancient Ruins",
  "Sky Realm",
  "Dragon Peak",
];

const GameButton = ({ label, onClick, disabled, loading, variant = "primary" }) => {
  const style =
    variant === "danger"
      ? APP_THEME.dangerButton
      : variant === "secondary"
        ? APP_THEME.secondaryButton
        : APP_THEME.primaryButton;

  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className={`px-6 py-3 ${style}`}>
      {loading ? "Please wait..." : label}
    </button>
  );
};

function CreativeQuest() {
  const [file, setFile] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAborting, setIsAborting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [missionState, setMissionState] = useState("idle");
  const [sessionId, setSessionId] = useState(null);
  const [mission, setMission] = useState(null);
  const [missionsHistory, setMissionsHistory] = useState([]);

  const { score, setScore } = useUserScore();
  const { refreshProfile } = useAuthContext();
  const authUser = useAuth();
  const { ageGroup } = useAge();
  const { skillLevel } = useSkill();
  const canvasRef = useRef(null);
  const didTimeoutSyncRef = useRef(false);

  const isPage = "CreativeQuest";
  const chapterNumber = mission?.chapterNumber || 1;
  const missionPrompt = mission?.missionPrompt || "";
  const level = authUser?.level ?? levelFromXp(score);
  const completedChapters = missionsHistory.filter((item) => item.status === "completed").length;
  const isBusy = isStarting || isAdvancing || isSubmitting || isAborting;

  const resetMissionUi = () => {
    setResponseText("");
    setLastResult(null);
    setFile(null);
    setIsCanvasEmpty(true);
    canvasRef.current?.clearCanvas?.();
  };

  useEffect(() => {
    const restoreSession = async () => {
      const savedSessionId = window.localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!savedSessionId) {
        setIsRestoring(false);
        return;
      }
      try {
        const response = await api.getGameSession(savedSessionId);
        const session = response.data;
        if (!session?.currentMission || session.status === "abandoned") {
          window.localStorage.removeItem(ACTIVE_SESSION_KEY);
          setIsRestoring(false);
          return;
        }
        setSessionId(session.sessionId);
        setMission(session.currentMission);
        setMissionsHistory(session.missions || []);
        setTimeLeft(session.currentMission.timerSeconds || 180);
        if (session.currentMission.status === "completed") {
          setMissionState("submitted");
        } else if (session.currentMission.status === "failed") {
          setMissionState("expired");
        } else {
          setMissionState("in_mission");
        }
      } catch (_error) {
        window.localStorage.removeItem(ACTIVE_SESSION_KEY);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (sessionId) {
      window.localStorage.setItem(ACTIVE_SESSION_KEY, sessionId);
    } else {
      window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }, [sessionId]);

  useEffect(() => {
    if (missionState !== "in_mission" || timeLeft <= 0) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [missionState, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && missionState === "in_mission") {
      setMissionState("expired");
    }
  }, [timeLeft, missionState]);

  useEffect(() => {
    const syncTimeout = async () => {
      if (!sessionId || missionState !== "expired" || didTimeoutSyncRef.current) return;
      didTimeoutSyncRef.current = true;
      try {
        await api.failCurrentMission(sessionId);
      } catch (_error) {
        // Keep UX responsive even if timeout sync fails.
      }
    };
    syncTimeout();
  }, [missionState, sessionId]);

  const applySessionMission = (currentMission, history) => {
    didTimeoutSyncRef.current = false;
    setMission(currentMission);
    setMissionsHistory(history);
    setTimeLeft(currentMission.timerSeconds || 180);
    setMissionState("in_mission");
    resetMissionUi();
  };

  const startAdventure = async () => {
    setIsStarting(true);
    try {
      const response = await api.createGameSession({ ageGroup, skillLevel });
      const currentMission = response.data.currentMission;
      setSessionId(response.data.sessionId);
      applySessionMission(currentMission, [currentMission]);
      showSuccess("Adventure started! Good luck on your first mission.");
    } catch (error) {
      showError(error, "Could not start your adventure. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const nextMission = async () => {
    if (!sessionId) return;
    setIsAdvancing(true);
    try {
      const response = await api.nextMission(sessionId, { ageGroup, skillLevel });
      const currentMission = response.data.currentMission;
      const nextHistory = [...missionsHistory, currentMission];
      setMissionsHistory(nextHistory);
      applySessionMission(currentMission, nextHistory);
      showSuccess(`Chapter ${currentMission.chapterNumber} is ready!`);
    } catch (error) {
      showError(error, "Could not load the next mission. Please try again.");
    } finally {
      setIsAdvancing(false);
    }
  };

  const abortMission = async () => {
    if (!sessionId) return;
    const confirmed = window.confirm("Abort this mission and return to the map?");
    if (!confirmed) return;

    setIsAborting(true);
    try {
      await api.abortSession(sessionId);
      setSessionId(null);
      setMission(null);
      setMissionsHistory([]);
      setMissionState("idle");
      setTimeLeft(0);
      resetMissionUi();
      showInfo("Mission aborted. You can start a new adventure anytime.");
    } catch (error) {
      showError(error, "Could not abort the mission. Please try again.");
    } finally {
      setIsAborting(false);
    }
  };

  const onSubmitMission = async () => {
    if (!file || !missionPrompt) {
      showError(null, "Please draw something on the canvas before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = await handleSendPrompt(file, missionPrompt, setResponseText, sessionId, chapterNumber, {
        setScore,
        refreshProfile,
      });

      setLastResult(payload);
      setMissionState("submitted");
      setMissionsHistory((previous) =>
        previous.map((item) =>
          item.chapterNumber === chapterNumber
            ? {
                ...item,
                status: "completed",
                score: payload.finalScore,
                xpEarned: payload.xpEarned,
              }
            : item
        )
      );

      const practiceScore =
        payload?.aiResult?.feedback?.toLowerCase().includes("busy") ||
        payload?.aiResult?.feedback?.toLowerCase().includes("practice score");
      if (practiceScore) {
        showInfo("Mission saved with a practice score while AI is busy. Try again later for a full review.");
      } else {
        showSuccess(`Mission complete! +${payload?.xpEarned ?? 0} XP earned.`);
      }
    } catch (error) {
      console.error("Submit failed:", error);
      showError(error, "Could not submit your drawing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const worldMarkers = useMemo(
    () =>
      WORLD_STRIP.map((world, index) => ({
        world,
        unlocked: index < chapterNumber,
        current: index === chapterNumber - 1,
      })),
    [chapterNumber]
  );

  const overlayTitle = isSubmitting
    ? "Scoring your masterpiece..."
    : isStarting
      ? "Generating your first mission..."
      : isAdvancing
        ? "Preparing the next chapter..."
        : "Loading adventure...";

  return (
    <SignInToPlay subtitle="Sign in with Google to start Creative Quest, earn XP, and save your adventure progress.">
    <div className={`flex flex-col gap-6 ${APP_THEME.page} p-2 sm:p-4`}>
      {(isBusy || isRestoring) && (
        <GameLoadingOverlay
          title={isRestoring ? "Restoring adventure..." : overlayTitle}
          subtitle={isSubmitting ? "Gemini is reviewing accuracy, creativity, and effort." : "Hang tight, explorer."}
        />
      )}

      <UserInfo setResponseText={setResponseText} isPage={isPage} />

      <section className="text-center">
        <h2 className={`text-2xl sm:text-3xl font-bold ${APP_THEME.heroGradient}`}>Creative Quest</h2>
        <p className={`mt-2 ${APP_THEME.subtleText}`}>
          Complete timed drawing missions, earn XP, and advance through five worlds.
        </p>
      </section>

      {!isRestoring && missionState === "idle" && (
        <div className="flex flex-col items-center gap-4">
          <GameButton label="Start Adventure" onClick={startAdventure} loading={isStarting} />
          <p className={`text-sm ${APP_THEME.subtleText}`}>
            Each chapter has a unique AI mission. Complete all 10 to finish the run.
          </p>
        </div>
      )}

      {mission && (
        <>
          <MissionHUD
            mission={mission}
            timeLeft={timeLeft}
            score={score}
            level={level}
            completedChapters={completedChapters}
            totalChapters={TOTAL_CHAPTERS}
            missionState={missionState}
          />

          <div className="flex flex-wrap gap-2">
            {worldMarkers.map(({ world, unlocked, current }) => (
              <span
                key={world}
                className={`rounded-full border px-3 py-1 text-xs ${
                  current
                    ? "border-cyan-400 bg-cyan-700/40 text-cyan-100"
                    : unlocked
                      ? "border-emerald-600/50 bg-emerald-900/30 text-emerald-200"
                      : "border-slate-700 bg-slate-900 text-slate-500"
                }`}
              >
                {world}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className={`${APP_THEME.gamePanel} flex flex-col gap-4`}>
              <DrawingCanvas
                ref={canvasRef}
                onDrawingComplete={(dataUrl) => handleDrawingComplete(dataUrl, setFile)}
                setIsCanvasEmpty={setIsCanvasEmpty}
                disabled={missionState !== "in_mission" || isSubmitting}
              />

              <div className="flex flex-wrap gap-3">
                <GameButton
                  label={isSubmitting ? "Submitting..." : "Submit Mission"}
                  onClick={onSubmitMission}
                  disabled={isCanvasEmpty || missionState !== "in_mission"}
                  loading={isSubmitting}
                />
                {missionState === "in_mission" && (
                  <GameButton
                    label="Abort Mission"
                    onClick={abortMission}
                    loading={isAborting}
                    variant="danger"
                  />
                )}
                {(missionState === "submitted" || missionState === "expired") && (
                  <GameButton
                    label={missionState === "expired" ? "Time Up — Next Mission" : "Next Mission"}
                    onClick={nextMission}
                    loading={isAdvancing}
                  />
                )}
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              {responseText && missionState === "submitted" && (
                <div className={APP_THEME.card}>
                  <AIResponse responseText={responseText} isPage={isPage} />
                  {lastResult?.xpEarned != null && (
                    <p className="mt-3 text-center text-lg font-bold text-emerald-300">
                      +{lastResult.xpEarned} XP earned
                      {lastResult.profile?.level != null ? ` · Level ${lastResult.profile.level}` : ""}
                    </p>
                  )}
                </div>
              )}

              {missionState === "expired" && !responseText && (
                <div className={`${APP_THEME.card} text-center`}>
                  <p className="text-lg font-bold text-red-300">Time is up!</p>
                  <p className={`mt-2 text-sm ${APP_THEME.subtleText}`}>
                    You can retry on the next mission or start a fresh adventure.
                  </p>
                </div>
              )}

              <HowPlay isPage={isPage} className={`text-sm ${APP_THEME.subtleText}`} />
            </aside>
          </div>
        </>
      )}
    </div>
    </SignInToPlay>
  );
}

export default CreativeQuest;
