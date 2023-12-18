import { generateInvitationToken } from "./invite-token";
import { add } from "date-fns";

export async function createHash(message: string) {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString();
}

export async function createInviteParams({
  baseUrl,
  id,
  email,
  roleId,
  organizationId,
  createExp,
}: {
  baseUrl: string;
  id: string;
  email: string;
  roleId: string;
  organizationId: string;
  createExp?: (v: Date) => Date;
}) {
  // we lower case teamName because there was a hack
  // to fix an ios issue with the magiclogin
  const callbackUrl = `/api/auth/invite/${id}?roleId=${roleId}&organizationId=${organizationId}`;

  return createLoginUrl({
    baseUrl,
    email,
    roleId,
    organizationId,
    callbackUrl,
    createExp,
  });
}

export async function createLoginUrl({
  baseUrl,
  email,
  roleId,
  organizationId,
  callbackUrl = "/",
  createExp,
}: {
  baseUrl: string;
  email: string;
  roleId: string;
  organizationId: string;
  callbackUrl?: string;
  createExp?: (v: Date) => Date;
}) {
  const token = generateInvitationToken({
    email,
    callbackUrl,
    roleId,
    organizationId,
  });
  const expires = createExp?.(new Date()) ?? add(new Date(), { days: 2 });
  const hash = await createHash(`${token}${process.env.NEXTAUTH_SECRET}`);
  const params = `${encodeURIComponent("email")}?email=${encodeURIComponent(
    email,
  )}&token=${token}&callbackUrl=${encodeURIComponent(callbackUrl)}`;

  const url = `${baseUrl}/api/auth/callback/${params}`;

  return {
    hash,
    url,
    expires,
  };
}
