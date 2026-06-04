import { api } from "../lib/api";

export const handleDrawingComplete = (dataUrl, setFile) => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(byteString.length);
  const data = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    data[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([buffer], { type: mimeString });
  setFile(new File([blob], "drawing.png", { type: mimeString }));
};

export const handleSendPrompt = async (
  file,
  prompt,
  setResponseText,
  sessionId,
  chapterNumber,
  { setScore, refreshProfile } = {}
) => {
  const imageDataUrl = await fileToDataUrl(file);
  const response = await api.submitCreativeQuest({
    sessionId,
    chapterNumber,
    missionPrompt: prompt,
    imageDataUrl,
  });

  const payload = response.data;
  setResponseText(
    JSON.stringify({
      accuracy: payload.aiResult?.accuracy,
      creativity: payload.aiResult?.creativity,
      effort: payload.aiResult?.effort,
      feedback: payload.aiResult?.feedback,
      finalScore: payload.finalScore,
      xpEarned: payload.xpEarned,
    })
  );

  if (payload.profile?.xp !== undefined) {
    setScore?.(payload.profile.xp);
    await refreshProfile?.();
  } else if (payload.xpEarned) {
    setScore?.((previous) => previous + payload.xpEarned);
  }

  return payload;
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
