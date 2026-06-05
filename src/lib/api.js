import { formatFriendlyError } from "./formatError.js";

const resolveBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL || "";
  // Guard against local .env values baked into a production Vercel build.
  if (import.meta.env.PROD && configured.includes("localhost")) {
    return "";
  }
  return configured;
};

const BASE_URL = resolveBaseUrl();
const AUTH_TOKEN_KEY = "ai-playground-auth-token";

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.friendlyMessage = formatFriendlyError({ message, status });
  }
}

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

const request = async (path, options = {}) => {
  const token = getAuthToken();
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (_error) {
    throw new ApiError("Failed to fetch", 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new ApiError(message, response.status, data);
  }

  return data;
};

export const api = {
  loginWithGoogle: (idToken) =>
    request("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),
  getMe: () => request("/api/v1/users/me"),
  getMyProfile: () => request("/api/v1/users/me/profile"),
  getGallery: () => request("/api/v1/gallery"),
  submitDrawingFeedback: (drawingId, body) =>
    request(`/api/v1/drawings/${drawingId}/feedback`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  generateCreativeQuestMission: (body) =>
    request("/api/v1/ai/creative-quest/mission", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  submitCreativeQuest: (body) =>
    request("/api/v1/ai/creative-quest/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  submitGuesswork: (body) =>
    request("/api/v1/ai/guesswork/submit", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  submitStoryChapter: (body) =>
    request("/api/v1/ai/stories/chapter", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getLeaderboard: () => request("/api/v1/leaderboard"),
  createGameSession: (body) =>
    request("/api/v1/games/sessions", {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
  getGameSession: (sessionId) => request(`/api/v1/games/sessions/${sessionId}`),
  nextMission: (sessionId, body) =>
    request(`/api/v1/games/sessions/${sessionId}/next-mission`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
  failCurrentMission: (sessionId) =>
    request(`/api/v1/games/sessions/${sessionId}/fail-current-mission`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  abortSession: (sessionId) =>
    request(`/api/v1/games/sessions/${sessionId}/abort`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  getMyAdventures: () => request("/api/v1/games/sessions/mine"),
};
