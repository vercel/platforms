import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import EventRoles from "@/components/event-roles";
import PageHeader from "@/components/dashboard-header";
import OpenModalButton from "@/components/open-modal-button";
import CreateRoleModal from "@/components/modal/create-role";
import prisma from "@/lib/prisma";
import notFound from "../not-found";
import { getUsersWithRoleInEvent } from "@/lib/actions";
export default async function EventRolesPage({
  params,
}: {
  params: { path: string; subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  //   const rolesAndUsers = await getEventRoles(event.id);
  const event = await prisma.event.findFirst({
    where: {
      path: params.path,
      organization: {
        subdomain: params.subdomain,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!event) {
    return notFound();
  }
  const eventRoles = await prisma.eventRole.findMany({
    where: {
      eventId: event.id,
    },
    include: {
      role: true
    },
  });
  await getUsersWithRoleInEvent(event.path)
  const roles = eventRoles.map((eventRole) => eventRole.role);

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Event Roles"
        ActionButton={
          <OpenModalButton text="Create new role">
            <CreateRoleModal />
          </OpenModalButton>
        }
      />
      <EventRoles event={event} roles={roles} />
    </div>
  );
}
