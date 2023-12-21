import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FORA_APP_URL, getCityUrl } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  ctx: {
    params: { id: string; orgSubdomain: string };
  },
) {
  const { id } = ctx.params;

  const invite = await prisma.invite.findUnique({ where: { id } });
  if (!invite || invite?.status !== "PENDING") {
    return notFound();
  }

  // Check if the user with the given email already exists
  let [user, role, org, orgRole] = await prisma.$transaction([
    prisma.user.findUnique({ where: { email: invite.email } }),
    prisma.role.findUnique({ where: { id: invite.roleId } }),
    prisma.organization.findUnique({ where: { id: invite.organizationId } }),
    prisma.organizationRole.findUnique({
      where: {
        roleId_organizationId: {
          roleId: invite.roleId,
          organizationId: invite.organizationId,
        },
      },
    }),
  ]);

  console.log("[user, role, org, orgRole]: ", [user, role, org, orgRole]);


  if (!role || !orgRole) {
    console.error("The role granted no longer exists.");
    return notFound();
  }

  if (!org) {
    console.error("The city no longer exists.");
    return notFound();
  }

  const successRedirectUrl = getCityUrl(org)

  if (!user) {
    // New User Signup

    // Create user and give role
    user = await prisma.user.create({
      data: {
        email: invite.email,
        // This came from their
        emailVerified: new Date(Date.now()).toISOString(),
      },
    });

    // accept invite by issuing role and updating invite
    const res = await prisma.$transaction([
      prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role?.id,
        },
      }),
      prisma.invite.update({
        where: {
          id: invite.id,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      }),
    ]);
    console.log("Invite Accepted: ", res);

    if (!res) {
      console.error("Failed to create roles.");
      return notFound();
    }

    return NextResponse.redirect(successRedirectUrl);
  } else {
    // Existing User Joined New City

    // Check if they are already have the role
    const userRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
    });
    if (userRole) {
      console.error("User already has this role.");
      return NextResponse.redirect(successRedirectUrl);
    }

    // accept invite by issuing role and updating invite
    await prisma.$transaction([
      prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role?.id,
        },
      }),
      prisma.invite.update({
        where: {
          id: invite.id,
        },
        data: {
          status: "ACCEPTED",
          acceptedAt: new Date(),
        },
      }),
    ]);
    return NextResponse.redirect(successRedirectUrl);
  }
}
