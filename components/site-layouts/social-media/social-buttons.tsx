import {
  getUniqueUsersWithRoleInEventsOfOrganization,
  getUniqueUsersWithRoleInOrganization,
} from "@/lib/actions";
import { Organization } from "@prisma/client";

export default async function SocialButtons({
  sitedata,
}: {
  sitedata: Organization;
}) {
  const [uniqueOrgRoleHolders, uniqueEventRoleHolders] = await Promise.all([
    getUniqueUsersWithRoleInOrganization(sitedata.subdomain as string),
    getUniqueUsersWithRoleInEventsOfOrganization(sitedata.subdomain as string),
  ]);

  return (
    <div className="mb-3 flex text-gray-700 dark:text-gray-400">
      <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="text-md mr-1 font-bold text-gray-850 dark:text-gray-200">
          {uniqueOrgRoleHolders}
        </span>
        <span>Members</span>
      </button>

      {/* <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="text-md mr-1 font-bold text-gray-850 dark:text-gray-200">
          {uniqueEventRoleHolders}
        </span>
        <span>Visited</span>
      </button> */}

      {/* <button className="mr-5 flex items-center justify-center rounded-md border border-transparent text-sm font-medium ">
        <span className="italic text-md mr-1 font-bold text-gray-850 dark:text-gray-200">
          Soon
        </span>
        <span>Backers</span>
      </button> */}
    </div>
  );
}
