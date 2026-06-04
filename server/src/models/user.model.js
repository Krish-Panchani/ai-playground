import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    googleSub: { type: String, index: true, unique: true, sparse: true },
    firebaseUid: { type: String, index: true, unique: true, sparse: true },
    email: { type: String, index: true },
    displayName: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    achievements: { type: [achievementSchema], default: [] },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
