import { db } from "@/lib/db"
import { tenants } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u
    if (emojiPattern.test(str)) {
      return true
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn(
      "Emoji regex validation failed, using fallback validation",
      error
    )
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10
}

type SubdomainData = {
  emoji: string
  createdAt: number
}

export async function getSubdomainData(
  subdomain: string
): Promise<SubdomainData | null> {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "")

  const result = await db
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, sanitizedSubdomain))

  if (!result[0]) return null

  return {
    emoji: result[0].emoji,
    createdAt: Number(result[0].created_at)
  }
}

export async function getAllSubdomains() {
  const rows = await db.select().from(tenants)

  return rows.map(row => ({
    subdomain: row.subdomain,
    emoji: row.emoji,
    createdAt: Number(row.created_at)
  }))
}
