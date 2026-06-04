import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { env } from "../config/env.js";

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

export const verifyGoogleIdToken = async (idToken) => {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured on the server");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub) {
    throw new Error("Invalid Google token payload");
  }

  return {
    googleSub: payload.sub,
    email: payload.email || null,
    displayName: payload.name || payload.email || "Player",
    picture: payload.picture || null,
  };
};

export const signAccessToken = (user) =>
  jwt.sign(
    {
      userId: String(user._id),
      googleSub: user.googleSub,
      email: user.email,
      name: user.displayName,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

export const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET);
