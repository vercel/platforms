import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET;

if (!SECRET)
  throw new Error("Please specify the NEXTAUTH_SECRET env variable.");

export type JwtPayload = {
  callbackUrl: string;
  email: string;
  roleId: string;
  organizationId: string;
};

/**
 * Decode an invitation token
 *
 * @example
 * ```ts
 * const { projectId } = decodeToken(req.query.token)
 * ```
 */
export const decodeInvitationToken = (token: string): JwtPayload | null => {
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};

/**
 * Generate an invitation token
 *
 * @example
 * ```ts
 * const token = generateToken({
 *   destination: user.email,
 *   projectId: project.id
 * })
 * ```
 */
export const generateInvitationToken = (
  payload: JwtPayload,
  expiresIn?: string,
): string =>
  jwt.sign(payload, SECRET, {
    expiresIn: expiresIn || "1w",
  });
