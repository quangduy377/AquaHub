import { app } from "./app.js";
import { env } from "./config/env.js";
import { database } from "./database/pool.js";

async function start(): Promise<void> {
  await database.query("SELECT 1");

  const server = app.listen(env.PORT, () => {
    console.log(`AquaHub API listening on http://localhost:${env.PORT}`);
  });

  async function shutdown(signal: string): Promise<void> {
    console.log(`${signal} received; shutting down`);
    server.close(async () => {
      await database.end();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch(async (error) => {
  console.error("Failed to start AquaHub API", error);
  await database.end();
  process.exit(1);
});
