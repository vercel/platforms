import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Event from "@/components/event";
import { getEventRolesAndUsers } from "@/lib/actions";

export default async function EventPage({
  params,
}: {
  params: { path: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const event = await prisma.event.findFirst({
    where: {
      path: params.path,
    },
    include: {
      organization: true,
    },
  });

  if (!event) {
    notFound();
  }

  const rolesAndUsers = await getEventRolesAndUsers(event.id);

  return <Event event={event} rolesAndUsers={rolesAndUsers} />;
}
