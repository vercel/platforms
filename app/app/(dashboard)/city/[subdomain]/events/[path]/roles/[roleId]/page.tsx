import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/dashboard-header";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import { updateEventRole } from "@/lib/actions";
import RoleCard from "@/components/role-card";
import Form from "@/components/form";
import DeleteEventRoleForm from "@/components/form/delete-event-role-form";

export default async function EventRolesPage({
  params,
}: {
  params: { path: string; subdomain: string; roleId: string };
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
    return notFound();
  }

  //   const rolesAndUsers = await getEventRoles(event.id);
  const eventRole = await prisma.eventRole.findUnique({
    where: {
      roleId_eventId: {
        roleId: params.roleId,
        eventId: event.id,
      },
    },
    include: {
      role: true,
    },
  });

  if (!eventRole) {
    return notFound();
  }
  const organization = event.organization;
  const role = eventRole?.role;

  const eventRoles = await prisma.eventRole.findMany({
    where: {
      eventId: event.id,
    },
    include: {
      role: true,
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader title={`${role.name}`} ActionButton={<div />} />
      <div className="grid gap-4 md:grid-cols-4">
        <RoleCard role={role} event={event} />
      </div>

      <Form
        title="Name"
        inputAttrs={{
          name: "name",
          type: "text",
          defaultValue: role?.name!,
          placeholder: "My Awesome Site",
          maxLength: 32,
        }}
        handleSubmit={updateEventRole}
      />

      <Form
        title="Description"
        inputAttrs={{
          name: "description",
          type: "text",
          defaultValue: role?.description!,
        }}
        handleSubmit={updateEventRole}
      />

      <DeleteEventRoleForm roleName={role?.name!} />
    </div>
  );
}
