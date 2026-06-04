import { UserModel } from "../models/user.model.js";
import { getOrCreateUserFromRequest, getUserProfile } from "../utils/get-or-create-user.js";

export const getMe = async (req, res) => {
  const user = await getOrCreateUserFromRequest(req.user);
  if (!user) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  return res.status(200).json({
    ok: true,
    data: getUserProfile(user),
  });
};

export const getLeaderboard = async (_req, res) => {
  const users = await UserModel.find({})
    .sort({ xp: -1 })
    .limit(50)
    .select("displayName email xp level badges")
    .lean();

  res.status(200).json({
    ok: true,
    data: users.map((user, index) => ({
      rank: index + 1,
      displayName: user.displayName,
      email: user.email,
      score: user.xp || 0,
      xp: user.xp || 0,
      level: user.level || 0,
      badges: user.badges || [],
    })),
  });
};
