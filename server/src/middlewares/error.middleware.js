export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    ok: false,
    message: "That page or action was not found.",
  });
};

const friendlyMessageFromError = (err) => {
  const raw = `${err?.message || ""} ${JSON.stringify(err?.error || err || "")}`.toLowerCase();

  if (
    raw.includes("high demand") ||
    raw.includes("unavailable") ||
    raw.includes("503") ||
    raw.includes("resource_exhausted")
  ) {
    return "Our AI helper is busy right now. Please wait a minute and try again.";
  }

  if (raw.includes("invalid or expired token") || raw.includes("jwt")) {
    return "Your session expired. Please sign in again.";
  }

  if (raw.includes("authentication required")) {
    return "Please sign in to continue.";
  }

  if (raw.includes("invalid request payload") || raw.includes("invalid payload")) {
    return "Something was wrong with that request. Please refresh and try again.";
  }

  if (raw.includes("google_client_id") || raw.includes("google token")) {
    return "Sign-in is not configured correctly on the server.";
  }

  if (raw.includes("econnrefused") || raw.includes("mongodb") || raw.includes("mongo")) {
    return "We could not reach the database. Please try again shortly.";
  }

  return null;
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const friendly =
    friendlyMessageFromError(err) ||
    (status >= 500 ? "Something went wrong on our side. Please try again." : null);
  const message = friendly || err.message || "Something went wrong. Please try again.";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    ok: false,
    message,
  });
};
