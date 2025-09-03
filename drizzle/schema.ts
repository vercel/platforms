import { pgTable, serial, text, bigint } from "drizzle-orm/pg-core"

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  subdomain: text("subdomain").notNull().unique(),
  emoji: text("emoji").notNull(),
  created_at: bigint("created_at", { mode: "number" }).notNull()
})
