import type { User as NextAuthUser } from "next-auth";

export type UserSettings = Pick<NextAuthUser, "name" | "email" | "image">;
