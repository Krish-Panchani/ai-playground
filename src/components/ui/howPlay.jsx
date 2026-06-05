import React from "react";

import { APP_THEME } from "../../theme/theme";

const panelClass = `flex flex-col items-start p-4 mb-4 rounded-lg ${APP_THEME.card}`;
const titleClass = `text-xl sm:text-2xl font-bold mb-2 ${APP_THEME.heroGradient}`;
const listClass = `list-decimal list-inside text-sm sm:text-base font-medium space-y-1 ${APP_THEME.subtleText}`;

export default function HowPlay({ isPage, className = "" }) {
  let content;
  switch (isPage) {
    case "CreativeQuest":
      content = (
        <div className={panelClass}>
          <h2 className={titleClass}>How to Play Creative Quest</h2>
          <ol className={listClass}>
            <li>Click &quot;Start Adventure&quot; to begin a timed AI mission.</li>
            <li>Draw your answer on the canvas before the timer runs out.</li>
            <li>Click &quot;Submit&quot; to send your drawing to Gemini for scoring.</li>
            <li>Earn XP from accuracy, creativity, and effort — then advance to the next mission.</li>
          </ol>
        </div>
      );
      break;
    case "ArtfulStories":
      content = (
        <div className={panelClass}>
          <h2 className={titleClass}>How to Play Artful Stories</h2>
          <ol className={listClass}>
            <li>Draw your imagination on the drawing board.</li>
            <li>Add an optional prompt or instruction for the AI.</li>
            <li>Click &quot;Submit chapter&quot; to upload your drawing.</li>
            <li>Follow the next drawing prompt and keep going — complete all 10 chapters for a full story.</li>
          </ol>
        </div>
      );
      break;
    case "ArtfulGuesswork":
      content = (
        <div className={panelClass}>
          <h2 className={titleClass}>How to Play Artful Guesswork</h2>
          <ol className={listClass}>
            <li>Draw anything that comes to your mind.</li>
            <li>Add an optional hint for the AI.</li>
            <li>Click &quot;Submit&quot; to upload your drawing.</li>
            <li>See if Gemini can guess what you drew.</li>
          </ol>
        </div>
      );
      break;
    default:
      content = null;
  }

  return <div className={className}>{content}</div>;
}
