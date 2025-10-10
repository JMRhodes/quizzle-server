import { defineConfig } from "drizzle-kit";
// drizzle.config.ts
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID,
    databaseId: process.env.DB_ID,
    token: process.env.D1_TOKEN,
  },
});
