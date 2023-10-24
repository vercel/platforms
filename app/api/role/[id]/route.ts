import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({
      error: "Not authenticated",
    });
  }
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
