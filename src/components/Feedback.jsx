import React from "react";

import { api } from "../lib/api";
import { showError, showSuccess } from "../lib/toast";

const Feedback = ({ setResponseText, canvasRef, setIsFeedback, drawingId }) => {
  const correctFeedback = [
    "Nice! Let's try another one!",
    "Great job, AI! Ready for the next?",
    "Spot on! Let's keep going!",
    "AI got it right! On to the next one!",
    "Correct! Let's see the next guess.",
    "Well done, AI! What's next?",
  ];

  const incorrectFeedback = [
    "Not quite, AI! Give it another shot.",
    "Oops, AI! Try again.",
    "Missed it, AI. Let's try the next one.",
    "Wrong guess, AI! Keep trying.",
    "AI didn't get it this time. Next!",
    "Incorrect, AI. Let's move on.",
  ];

  const getRandomFeedback = (feedbackArray) => {
    const randomIndex = Math.floor(Math.random() * feedbackArray.length);
    return feedbackArray[randomIndex];
  };

  const handleNewBoard = () => {
    setResponseText("");
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleFeedback = (isCorrect) => async () => {
    const feedbackMessage = isCorrect
      ? getRandomFeedback(correctFeedback)
      : getRandomFeedback(incorrectFeedback);

    setIsFeedback(feedbackMessage);

    try {
      if (drawingId) {
        await api.submitDrawingFeedback(drawingId, { isCorrect });
        showSuccess(isCorrect ? "Marked as correct — thanks!" : "Marked as incorrect — thanks!");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      showError(error, "Could not save your feedback. Please try again.");
    }

    setTimeout(() => {
      setIsFeedback("");
    }, 3000);

    setResponseText("");
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleFeedback(true)}
        className="bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap"
      >
        Correct!
      </button>
      <button
        type="button"
        onClick={handleFeedback(false)}
        className="bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap"
      >
        Incorrect!
      </button>
      <button
        type="button"
        onClick={handleNewBoard}
        className="bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-white font-semibold rounded-full whitespace-nowrap"
      >
        New
      </button>
    </div>
  );
};

export default Feedback;
