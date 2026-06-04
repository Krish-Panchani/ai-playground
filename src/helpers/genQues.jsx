import { api } from "../lib/api";
import { showError } from "../lib/toast";

export const handleGenerateQuestion = async (
  setLoadingQuestion,
  setQuestion,
  setPrompt,
  ageGroup,
  skillLevel,
  playerLevel,
  canvasRef,
  setResponseText
) => {
  setLoadingQuestion(true);
  try {
    const response = await api.generateCreativeQuestMission({
      ageGroup,
      skillLevel,
      level: playerLevel || 0,
    });
    const generatedQuestion = response.data?.missionPrompt || "Draw a magical tree in moonlight.";
    setQuestion(generatedQuestion);
    setPrompt(generatedQuestion);
    setResponseText("");

    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  } catch (error) {
    console.error("Error generating question:", error);
    showError(error, "Could not generate a new question. Please try again.");
  } finally {
    setLoadingQuestion(false);
  }
};
