const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const collectErrorText = (error) => {
  if (!error) return "";
  const parts = [
    error.message,
    error.status,
    error.code,
    error?.error?.message,
    error?.error?.code,
    error?.error?.status,
  ];
  try {
    parts.push(JSON.stringify(error));
  } catch (_e) {
    // ignore circular refs
  }
  return parts.filter(Boolean).join(" ").toLowerCase();
};

export const isGeminiRetryableError = (error) => {
  const text = collectErrorText(error);
  const status = error?.status ?? error?.error?.status ?? error?.code ?? error?.error?.code;
  if ([429, 500, 502, 503, 504].includes(Number(status))) {
    return true;
  }
  return (
    text.includes("unavailable") ||
    text.includes("high demand") ||
    text.includes("resource_exhausted") ||
    text.includes("overloaded") ||
    text.includes("try again later")
  );
};

export const withGeminiRetry = async (fn, { maxAttempts = 4, baseDelayMs = 700 } = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const canRetry = isGeminiRetryableError(error) && attempt < maxAttempts;
      if (!canRetry) {
        throw error;
      }
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(`Gemini request failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
};
