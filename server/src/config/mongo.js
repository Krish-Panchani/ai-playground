import mongoose from "mongoose";
import { env } from "./env.js";

export const connectMongo = async () => {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
  });

  console.log("MongoDB connected");
};
