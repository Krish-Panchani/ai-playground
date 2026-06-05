import mongoose from "mongoose";
import { env } from "./env.js";

/** Reuse one connection across Vercel serverless invocations (warm instances). */
const globalCache = globalThis;

if (!globalCache.__mongo) {
  globalCache.__mongo = { conn: null, promise: null };
}

const cache = globalCache.__mongo;

export const connectMongo = async () => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.MONGODB_URI, {
        dbName: env.MONGODB_DB_NAME,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};
