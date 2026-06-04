import { api } from "../lib/api";
import { showError, showSuccess } from "../lib/toast";

export const handleDrawingComplete = (dataUrl, setFile) => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(byteString.length);
  const data = new Uint8Array(buffer);
  for (let index = 0; index < byteString.length; index += 1) {
    data[index] = byteString.charCodeAt(index);
  }
  const blob = new Blob([buffer], { type: mimeString });
  setFile(new File([blob], "drawing.png", { type: mimeString }));
};

export const handleUpload = async (
  file,
  setLoadingUpload,
  handleSendPrompt,
  prompt,
  setResponseText,
  setLoadingResponse,
  setScore,
  setDrawingId
) => {
  if (!file) {
    showError(null, "Please draw something before submitting.");
    return;
  }

  setLoadingUpload(true);
  try {
    await handleSendPrompt(
      file,
      prompt,
      setResponseText,
      setLoadingResponse,
      setScore,
      setDrawingId
    );
  } finally {
    setLoadingUpload(false);
  }
};

export const handleSendPrompt = async (
  file,
  prompt,
  setResponseText,
  setLoadingResponse,
  setScore,
  setDrawingId
) => {
  setLoadingResponse(true);

  try {
    const imageDataUrl = await fileToDataUrl(file);
    const response = await api.submitGuesswork({
      imageDataUrl,
      additionalPrompt: prompt,
    });

    const payload = response.data?.aiResult || {};
    if (setDrawingId && response.data?.drawingId) {
      setDrawingId(String(response.data.drawingId));
    }
    setResponseText(
      JSON.stringify(
        {
          guess: payload.guess,
          confidence: payload.confidence,
          feedback: payload.feedback,
        },
        null,
        2
      )
    );
    if (response.data?.profile?.xp !== undefined) {
      setScore(response.data.profile.xp);
    } else {
      setScore((previous) => previous + (response.data?.xpEarned || 8));
    }

    const busyHint = payload?.feedback?.toLowerCase().includes("busy");
    if (busyHint) {
      showSuccess("Guess received! AI is busy — this is a practice result.");
    } else {
      showSuccess("Guess received! Tell us if the AI was right.");
    }
  } catch (error) {
    console.error("Error getting response from backend:", error);
    showError(error, "Could not analyze your drawing. Please try again.");
  } finally {
    setLoadingResponse(false);
  }
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
