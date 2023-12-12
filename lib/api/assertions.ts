import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { userHasEventRole } from "../actions";

export const tryGetSession = async () => {
  const session = await getSession();
  if (!session) {
    throw {
      message: "Invalid Authentication",
      code: 402,
    };
  }
  return session;
};

export const tryGetEvent = async (id?: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: id,
    },
  });

  if (!event || !id) {
    throw {
      message: "Invalid event",
      code: 401,
    };
  }
  return event;
};

export const assertUserHasEventRole = async (
  userId: string,
  eventId: string,
  role: string,
) => {
  const hasRole = await userHasEventRole(userId, eventId, role);
  if (!hasRole) {
    throw {
      message: "User does not have permission to create event role.",
      code: 402,
    };
  }
};
