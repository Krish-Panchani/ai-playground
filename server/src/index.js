import app from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";

const PORT = env.PORT;

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

start();
