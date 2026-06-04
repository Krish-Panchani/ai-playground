import { UserModel } from "../models/user.model.js";
import { levelFromXp } from "../services/progression.service.js";

export const getOrCreateUser = async (profile) => {
  if (!profile?.googleSub) {
    return null;
  }

  const updated = await UserModel.findOneAndUpdate(
    { googleSub: profile.googleSub },
    {
      $setOnInsert: { googleSub: profile.googleSub },
      $set: {
        email: profile.email || null,
        displayName: profile.displayName || profile.email || "Player",
      },
    },
    { new: true, upsert: true }
  );

  return updated;
};

export const getOrCreateUserFromRequest = async (reqUser) => {
  if (!reqUser?.uid) {
    return null;
  }

  return getOrCreateUser({
    googleSub: reqUser.uid,
    email: reqUser.email,
    displayName: reqUser.name,
  });
};

export const getUserProfile = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    displayName: user.displayName,
    email: user.email,
    xp: user.xp || 0,
    level: user.level ?? levelFromXp(user.xp || 0),
    streak: user.streak || 0,
    badges: user.badges || [],
  };
};
