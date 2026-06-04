import { getOrCreateUser, getUserProfile } from "../utils/get-or-create-user.js";
import { signAccessToken, verifyGoogleIdToken } from "../services/auth.service.js";

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ ok: false, message: "idToken is required" });
  }

  const googleProfile = await verifyGoogleIdToken(idToken);
  const user = await getOrCreateUser(googleProfile);
  const token = signAccessToken(user);

  return res.status(200).json({
    ok: true,
    data: {
      token,
      user: getUserProfile(user),
    },
  });
};
