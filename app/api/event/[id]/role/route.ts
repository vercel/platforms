import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import {
  assertUserHasEventRole,
  tryGetEvent,
  tryGetSession,
} from "@/lib/assertions";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const event = await tryGetEvent(context.params.id);
    const roles = await prisma.eventRole.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        role: true,
      },
    });

    const eventRoles = roles.map((role) => role.role);

    return NextResponse.json({ data: eventRoles }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message,
      },
      {
        status: error?.code,
      },
    );
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const session = await tryGetSession();
    const event = await tryGetEvent(context.params.id);
    await assertUserHasEventRole(session.user.id, event.id, "Admin");

    const { name } = (await request.json()) as { name: string };
    // TODO: validate the json

    const role = await prisma.role.create({
      data: {
        name,
      },
    });

    await prisma.eventRole.create({
      data: {
        eventId: event.id,
        roleId: role.id,
      },
    });

    return NextResponse.json({ role }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message,
      },
      {
        status: error?.code,
      },
    );
  }
}
