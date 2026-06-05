import React from "react";

import { showSuccess } from "../lib/toast";
import { APP_THEME } from "../theme/theme";

const ContinueStoryChapter = ({ nextMission, onContinue, chapterCount, maxChapters }) => {
  const handleContinue = () => {
    onContinue();
    showSuccess(`Chapter ${chapterCount + 1} of ${maxChapters} — draw the next scene!`);
  };

  return (
    <div className={`w-full max-w-xl rounded-lg border border-cyan-500/40 bg-slate-950 p-4 ${APP_THEME.subtleText}`}>
      {nextMission && (
        <p className="mb-3 text-sm">
          <span className="font-semibold text-cyan-300">Next drawing: </span>
          {nextMission}
        </p>
      )}
      <button
        type="button"
        onClick={handleContinue}
        className={`w-full px-4 py-2 ${APP_THEME.primaryButton}`}
      >
        Draw Chapter {chapterCount + 1} of {maxChapters}
      </button>
    </div>
  );
};

export default ContinueStoryChapter;
