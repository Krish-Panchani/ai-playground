const STATUS_MESSAGES = {
  400: "That request was not valid. Please check your input and try again.",
  401: "Please sign in to continue.",
  403: "You do not have permission to do that.",
  404: "We could not find what you were looking for.",
  408: "The request took too long. Please try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our side. Please try again shortly.",
  502: "The game server is having trouble. Please try again in a moment.",
  503: "The game server is temporarily unavailable. Please try again soon.",
  504: "The server took too long to respond. Please try again.",
};

const patternMessages = [
  {
    test: (text) => text.includes("failed to fetch") || text.includes("networkerror"),
    message: "We could not reach the game server. Make sure the API is running, then try again.",
  },
  {
    test: (text) =>
      text.includes("high demand") ||
      text.includes("unavailable") ||
      text.includes("503") ||
      text.includes("resource_exhausted"),
    message: "Our AI helper is busy right now. Please wait a minute and try again.",
  },
  {
    test: (text) => text.includes("invalid or expired token") || text.includes("authentication required"),
    message: "Your session expired. Please sign in again.",
  },
  {
    test: (text) => text.includes("google_client_id") || text.includes("google token"),
    message: "Sign-in is not set up correctly. Contact support or try again later.",
  },
  {
    test: (text) => text.includes("mongodb") || text.includes("mongo"),
    message: "We could not save your progress right now. Please try again shortly.",
  },
];

const extractMessageFromJsonString = (raw) => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed);
    return (
      parsed?.message ||
      parsed?.error?.message ||
      parsed?.error?.status?.message ||
      (typeof parsed?.error === "string" ? parsed.error : null)
    );
  } catch (_error) {
    return null;
  }
};

const isTechnicalMessage = (message) => {
  const text = message.toLowerCase();
  return (
    text.includes("typeerror") ||
    text.includes("syntaxerror") ||
    text.includes("undefined") ||
    text.includes("json") ||
    text.length > 180 ||
    (text.includes("{") && text.includes("}"))
  );
};

export const formatFriendlyError = (error, fallback = "Something went wrong. Please try again.") => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return formatFriendlyError({ message: error }, fallback);
  }

  const status = error.status || error.statusCode;
  if (status && STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  let message = error.friendlyMessage || error.message || "";

  const nested = extractMessageFromJsonString(message);
  if (nested) {
    message = nested;
  }

  const lower = String(message).toLowerCase();
  for (const rule of patternMessages) {
    if (rule.test(lower)) {
      return rule.message;
    }
  }

  if (!message || isTechnicalMessage(message)) {
    return fallback;
  }

  if (message.length > 0 && message.length <= 160 && !message.includes('{"')) {
    return message;
  }

  return fallback;
};
