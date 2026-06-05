import React, { useCallback } from "react";

import { APP_THEME } from "../theme/theme";

const AIResponse = React.memo(({ responseText, isPage }) => {
  const renderGuessResponse = useCallback((responseText) => {
    try {
      const response = JSON.parse(responseText);
      const { guess } = response;
      return (
        <div className="mt-4 rounded-lg border border-orange-300 p-4 text-white">
          <p>
            🤔 <span className="font-bold text-white">{guess}</span>
          </p>
        </div>
      );
    } catch (error) {
      console.error("Error parsing response:", error);
      return <p>Invalid response format</p>;
    }
  }, []);

  const renderStoryResponse = useCallback((responseText) => {
    try {
      const response = JSON.parse(responseText);
      const {
        title,
        story,
        nextMission,
        chapterCount,
        maxChapters,
        isCompleted,
        fullStory,
        conclusion,
        chapters,
      } = response;

      if (isCompleted && fullStory) {
        return (
          <div className="mt-4 space-y-4 rounded-lg border border-green-500/50 p-4 text-white">
            <p className={`text-sm font-semibold uppercase tracking-wide ${APP_THEME.accentText}`}>
              Story complete — {chapterCount} chapters
            </p>
            <h2
              className={`text-xl font-bold uppercase ${APP_THEME.heroGradient}`}
            >
              {title}
            </h2>
            <p className="whitespace-pre-line text-justify leading-relaxed text-slate-100">
              {fullStory}
            </p>
            {conclusion && (
              <p className="border-t border-slate-700 pt-3 italic text-orange-200">{conclusion}</p>
            )}
            {Array.isArray(chapters) && chapters.length > 0 && (
              <details className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm">
                <summary className="cursor-pointer font-semibold text-cyan-300">
                  View chapter breakdown
                </summary>
                <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-300">
                  {chapters.map((chapter) => (
                    <li key={chapter.chapterNumber}>
                      <span className="font-semibold text-white">{chapter.title}</span>
                      <p className="mt-1">{chapter.chapter}</p>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </div>
        );
      }

      return (
        <div className="mt-4 space-y-3 rounded-lg border border-orange-300 p-4 text-white">
          <p className={`text-sm font-semibold ${APP_THEME.accentText}`}>
            Chapter {chapterCount} of {maxChapters || 10}
          </p>
          <h2 className={`text-xl font-bold uppercase ${APP_THEME.heroGradient}`}>{title}</h2>
          <p className="whitespace-pre-line text-justify leading-relaxed">{story}</p>
          {nextMission && (
            <p className="rounded-lg border border-cyan-500/30 bg-slate-900/80 p-3 text-sm text-cyan-100">
              <span className="font-semibold text-cyan-300">Draw next: </span>
              {nextMission}
            </p>
          )}
        </div>
      );
    } catch (error) {
      console.error("Error parsing response:", error);
      return <p>Invalid response format</p>;
    }
  }, []);

  const renderQueResponse = useCallback((responseText) => {
    try {
      const response = JSON.parse(responseText);
      const { accuracy, creativity, effort, feedback, finalScore, xpEarned } = response;
      return (
        <div className="mt-4 rounded-lg border border-green-300 p-4 text-white">
          <p>
            Accuracy: <span className="font-bold text-cyan-300">{accuracy}</span>
          </p>
          <p>
            Creativity: <span className="font-bold text-cyan-300">{creativity}</span>
          </p>
          <p>
            Effort: <span className="font-bold text-cyan-300">{effort}</span>
          </p>
          <p>
            Final Score: <span className="font-bold text-green-300">{finalScore}</span>
          </p>
          <p>
            XP Earned: <span className="font-bold text-orange-300">+{xpEarned}</span>
          </p>
          <p className="mt-2">{feedback}</p>
        </div>
      );
    } catch (error) {
      console.error("Error parsing response:", error);
      return <p>Invalid response format</p>;
    }
  }, []);

  const storyHeading =
    isPage === "ArtfulStories" ? "Story Chapter" : "Mission Results";

  return (
    <div className="flex items-center justify-center text-white">
      <div className="w-full rounded-xl">
        <h3 className={`text-xl font-bold ${APP_THEME.loadingGradient}`}>{storyHeading}</h3>
        {isPage === "CreativeQuest" && renderQueResponse(responseText)}
        {isPage === "ArtfulStories" && renderStoryResponse(responseText)}
        {isPage === "ArtfulGuesswork" && renderGuessResponse(responseText)}
      </div>
    </div>
  );
});

export default AIResponse;
