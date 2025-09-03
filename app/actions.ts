"use server"

import { db } from "@/lib/db"
import { tenants } from "@/drizzle/schema"
import { isValidIcon } from "@/lib/subdomains"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { rootDomain, protocol } from "@/lib/utils"
import { eq } from "drizzle-orm"

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get("subdomain") as string
  const icon = formData.get("icon") as string

  if (!subdomain || !icon) {
    return { success: false, error: "Subdomain and icon are required" }
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: "Please enter a valid emoji (maximum 10 characters)"
    }
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "")

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        "Subdomain can only have lowercase letters, numbers, and hyphens. Please try again."
    }
  }

  // Check if subdomain already exists
  const exists = await db
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, sanitizedSubdomain))

  if (exists.length > 0) {
    return {
      subdomain,
      icon,
      success: false,
      error: "This subdomain is already taken"
    }
  }

  // Insert new tenant
  await db.insert(tenants).values({
    subdomain: sanitizedSubdomain,
    emoji: icon,
    created_at: Date.now()
  })

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`)
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get("subdomain") as string

  await db.delete(tenants).where(eq(tenants.subdomain, subdomain))

  revalidatePath("/admin")
  return { success: "Domain deleted successfully" }
}
