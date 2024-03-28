import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { DrizzleClient } from "./db/db"
import { users, sessions, accounts } from "./db/schema"
import { AdapterUser } from "next-auth/adapters"

export const createDrizzleAdapter = (db: DrizzleClient) => {
  const adapter = DrizzleAdapter(db)
  
  adapter.createUser = async (data) => {
    return await db
        .insert(users)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null) as AdapterUser
  }

  adapter.createSession = async (data) => {
    return await db
    .insert(sessions)
    .values(data)
    .returning()
    .then((res) => res[0])
  }

  adapter.updateUser = async (data) => {
    if (!data.id) {
      throw new Error("No user id.")
    }

    return await db
      .update(users)
      .set(data)
      .where(eq(users.id, data.id))
      .returning()
      .then((res) => res[0]) as AdapterUser
  }

  adapter.updateSession = async (data) => {
    return await db
    .update(sessions)
    .set(data)
    .where(eq(sessions.sessionToken, data.sessionToken))
    .returning()
    .then((res) => res[0])
  }

  adapter.linkAccount = async (rawAccount) => {
     return await  db
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]) as any
  }
  
  return adapter
}
