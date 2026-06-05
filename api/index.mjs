import app from "../server/src/app.js";
import { connectMongo } from "../server/src/config/mongo.js";

/**
 * Vercel serverless entry — wraps the Express app for /api/* and /health.
 * Local dev still uses server/src/index.js with app.listen().
 */
export default async function handler(req, res) {
  await connectMongo();
  return app(req, res);
}
