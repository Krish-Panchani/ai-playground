import { api } from "../lib/api";
import { showError, showSuccess } from "../lib/toast";
import { useGameStore } from "../store/useGameStore";

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
  user
) => {
  if (!file) {
    showError(null, "Please draw something before submitting.");
    return;
  }

  setLoadingUpload(true);
  try {
    await handleSendPrompt(file, prompt, setResponseText, setLoadingResponse, setScore, user);
  } finally {
    setLoadingUpload(false);
  }
};

export const handleSendPrompt = async (
  file,
  prompt,
  setResponseText,
  setLoadingResponse,
  setScore
) => {
  setLoadingResponse(true);
  try {
    const imageDataUrl = await fileToDataUrl(file);
    const storyId = useGameStore.getState().storyId;
    const response = await api.submitStoryChapter({
      imageDataUrl,
      additionalPrompt: prompt,
      storyId: storyId || undefined,
    });

    const payload = response.data;
    if (payload.storyId) {
      useGameStore.getState().setStoryId(payload.storyId);
    }

    setResponseText(
      JSON.stringify(
        {
          title: payload.aiResult.title,
          story: payload.aiResult.chapter,
          nextMission: payload.aiResult.nextMission,
          chapterCount: payload.chapterCount,
          isCompleted: payload.isCompleted,
        },
        null,
        2
      )
    );
    if (response.data?.profile?.xp !== undefined) {
      setScore(response.data.profile.xp);
    } else {
      await setScore((previous) => previous + (response.data?.xpEarned || 15));
    }

    if (payload.isCompleted) {
      showSuccess("Story complete! What an adventure.");
    } else {
      showSuccess(`Chapter ${payload.chapterCount} added to your story!`);
    }
  } catch (error) {
    console.error("Error getting response from backend:", error);
    showError(error, "Could not create the next story chapter. Please try again.");
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