/* 
    This was the migration script we used to migrate from
    our old database to the new Vercel Postgres database.
    It's not needed anymore, but I'm keeping it here for
    posterity.
*/

import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({
      error: "Not authenticated",
    });
  }
  console.log("session: ", session);

  // const allCookies = cookies().getAll();
  // console.log("allCookies: ", allCookies);
  try {
    const role = await prisma.role.findUnique({
      where: {
        id: context.params.id,
      },
    });
    return NextResponse.json({ role });
  } catch (error: any) {
    return NextResponse.json({
      error: error?.message,
    });
  }
}
