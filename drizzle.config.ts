import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
