import { getServerSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import TwitterProvider from "next-auth/providers/twitter";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { userHasEventRole, userHasOrgRole } from "./actions";
import { NextRequest } from "next/server";
import { headers } from "next/headers";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions = (req?: NextRequest): NextAuthOptions => {
  const host = req?.headers.get("host");
  const allHeaders = headers();
  const xForwardedHost = allHeaders.get('x-forwarded-host')
  const hostname = host || xForwardedHost ||  process.env.NEXTAUTH_URL
  console.log({ hostname, host, xForwardedHost })

  return {
    providers: [
      // passwordless / magic link

      EmailProvider({
        server: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        from: process.env.SMTP_FROM,
      }),
      // sign in with ethereum
      CredentialsProvider({
        name: "Ethereum",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials, req) {
          try {
            if (!process.env.NEXTAUTH_URL) {
              throw new Error("NEXTAUTH_URL is not set");
            }

            const siwe = new SiweMessage(
              JSON.parse(credentials?.message || "{}"),
            );
            // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);

            // console.log('nextAuthUrl: ', nextAuthUrl)
            const nonce = await getCsrfToken();

            console.log("nonce", nonce);
            // if (siwe.nonce !== nonce) {
            //   return null;
            // }

            const result = await siwe.verify({
              signature: credentials?.signature || "",
              domain: hostname,
              // nonce: nonce,
            });
            console.log("result", result);
            if (result.success) {
              // Check if account already exists
              let account = await prisma.account.findFirst({
                where: {
                  providerAccountId: siwe.address,
                },
                include: {
                  user: true,
                },
              });

              console.log("account", account);

              // If account does not exist, create a new account and user
              if (!account) {
                const user = await prisma.user.create({
                  data: {
                    eth_address: siwe.address,
                    // ens_name:
                    /* user data */
                  },
                });

                try {
                  account = await prisma.account.create({
                    data: {
                      type: "ethereum", // Add this line
                      provider: "ethereum", // Add this line
                      providerAccountId: siwe.address, // Add this line
                      user: {
                        connect: {
                          id: user.id,
                        },
                      },
                    },
                    include: {
                      user: true, // Include the user
                    },
                  });
                } catch (error) {
                  console.log("error", error);
                }
              }
              console.log("account", account);
              if (!account?.user) {
                return null;
              }

              return {
                ...account.user,
                id: account.user.id,
              };
            }
            return null;
          } catch (e) {
            return null;
          }
        },
      }),
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID as string,
        clientSecret: process.env.AUTH_GITHUB_SECRET as string,
        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            gh_username: profile.login,
            email: profile.email,
            image: profile.avatar_url,
          };
        },
      }),
    ],
    pages: {
      signIn: `/login`,
      verifyRequest: `/login`,
      error: "/login", // Error code passed in query string as ?error=
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameorganization: "lax",
          path: "/",
          // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
          domain: hostname?.includes("localhost:3000") ? undefined : hostname,
          secure: VERCEL_DEPLOYMENT,
        },
      },
    },
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.user = user;
        }
        return token;
      },
      session: async ({ session, token }) => {
        console.log('session', session, 'token', token)
        session.user = {
          ...session.user,
          // @ts-expect-error
          id: token.sub,
          // @ts-expect-error
          username: token?.user?.username || token?.user?.gh_username,
        };
        return session;
      },
    },
  };
};

export function getSession() {
  return getServerSession(authOptions()) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
      eth_address?: string;
      ens_name?: string;
    };
  } | null>;
}

export function withOrganizationAuth(action: any) {
  return async (
    formData: FormData | null,
    context: { params: { subdomain: string } },
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const organization = await prisma.organization.findUnique({
      where: {
        subdomain: context.params.subdomain,
      },
    });

    if (!organization) {
      return {
        error: "Organization not found",
      };
    }

    const userIsOrgAdmin = await userHasOrgRole(
      session.user.id,
      organization.id,
      "Admin",
    );

    if (!userIsOrgAdmin) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, organization, key);
  };
}

export function withEventAuth(action: any) {
  return async (
    formData: any | null,
    context: { params: { subdomain: string; path: string } },
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const data = await prisma.event.findFirst({
      where: {
        organization: {
          subdomain: context.params.subdomain,
        },
        path: context.params.path,
      },
      include: {
        organization: true,
      },
    });

    console.log(data);

    if (!data?.organization) {
      return {
        error: "Organization not found",
      };
    }

    const userIsEventHost = await userHasEventRole(
      session.user.id,
      data.id,
      "Host",
    );

    if (!userIsEventHost) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, data, key);
  };
}

export function withEventRoleAuth(action: any) {
  return async (
    formData: FormData | null,
    context: { params: { subdomain: string; path: string; roleId: string } },
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const event = await prisma.event.findFirst({
      where: {
        organization: {
          subdomain: context.params.subdomain,
        },
        path: context.params.path,
      },
      include: {
        organization: true,
      },
    });
    if (!event) {
      return {
        error: "Event not found",
      };
    }
    //   const rolesAndUsers = await getEventRoles(event.id);
    const eventRole = await prisma.eventRole.findUnique({
      where: {
        roleId_eventId: {
          roleId: context.params.roleId,
          eventId: event.id,
        },
      },
      include: {
        role: true,
      },
    });

    console.log(event);

    if (!eventRole?.role) {
      return {
        error: "Role not found",
      };
    }

    const userIsEventHost = await userHasEventRole(
      session.user.id,
      event.id,
      "Host",
    );

    if (!userIsEventHost) {
      return {
        error: "Not authorized",
      };
    }

    const data = {
      role: eventRole.role,
      event,
      organization: event.organization,
    };

    return action(formData, data, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        organization: true,
      },
    });
    if (!post || post.userId !== session.user.id) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}
