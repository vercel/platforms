import PageHeader from "@/components/dashboard-header";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
import { updateEventRole } from "@/lib/actions";
import RoleCard from "@/components/role-card";
import Form from "@/components/form";
import DeleteEventRoleForm from "@/components/form/delete-event-role-form";

export default async function RolePage({
  params,
}: {
  params: { subdomain: string; roleId: string };
}) {
  const [org, role] = await prisma.$transaction([
    prisma.organization.findUnique({
      where: {
        subdomain: params.subdomain,
      },
    }),
    prisma.role.findUnique({
      where: {
        id: params.roleId,
      },
    }),
  ]);

  console.log("org: ", org, "role: ", role);

  if (!org || !role) {
    return notFound();
  }

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader title={`${role.name}`} ActionButton={<div />} />
      <div className="grid grid-cols-3">
        <div className="col-span-3 md:col-span-2 space-y-6">
          <Form
            title="Name"
            description="The name of your role."
            helpText="Please use 32 characters maximum."
            inputAttrs={{
              name: "name",
              type: "text",
              defaultValue: role?.name!,
              maxLength: 32,
            }}
            handleSubmit={updateEventRole}
          />

          <Form
            title="Description"
            description="The description of your role."
            helpText=""
            inputAttrs={{
              name: "description",
              type: "text",
              defaultValue: role?.description!,
            }}
            handleSubmit={updateEventRole}
          />

          <DeleteEventRoleForm roleName={role?.name!} />
        </div>
      </div>
    </div>
  );
}
