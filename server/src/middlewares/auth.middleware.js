import { verifyAccessToken } from "../services/auth.service.js";

const attachUserFromToken = (decoded) => {
  return {
    userId: decoded.userId,
    uid: decoded.googleSub,
    email: decoded.email || null,
    name: decoded.name || null,
  };
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);
    req.user = attachUserFromToken(decoded);
    return next();
  } catch (_error) {
    req.user = null;
    return next();
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ ok: false, message: "Authentication required" });
    }

    const decoded = verifyAccessToken(token);
    req.user = attachUserFromToken(decoded);
    return next();
  } catch (_error) {
    return res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
};
