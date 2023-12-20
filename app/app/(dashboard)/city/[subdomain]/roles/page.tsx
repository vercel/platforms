import OrgRoles from "@/components/org-roles";
import PageHeader from "@/components/dashboard-header";
import OpenModalButton from "@/components/open-modal-button";
import CreateRoleModal from "@/components/modal/create-role";

export default function EventRolesPage({
  params,
}: {
  params: { subdomain: string };
}) {
  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Organization Roles"
        ActionButton={
          <OpenModalButton text="Create new role">
            <CreateRoleModal />
          </OpenModalButton>
        }
      />
      <OrgRoles params={params} />
    </div>
  );
}
