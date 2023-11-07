import { Event, Role, Organization } from "@prisma/client";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

const getPlaceholderImage = (role: Role) => {
  // @ts-ignore
  if (role?.image) {
    return role?.name;
  }
  switch (role.name.toLowerCase()) {
    case "host":
      return `/host.png`;
    case "vip":
      return `/vip.png`;
    case "speaker":
      return `/speaker.png`;
    case "general admission":
    case "general":
      return `/general.png`;
    case "accommodation":
      return `/general.png`;
    case "hacker":
    case "hackers":
      return `/hacker.png`;
    case "volunteer":
    case "volunteers":
      return `/volunteer.png`;
    case "vc":
    case "vcs":
      return `/vc.png`;
  }
};

export default function RoleCard({
  role,
  event,
}: {
  role: Role;
  event: Event & { organization: Organization };
}) {
  const roleImage = getPlaceholderImage(role);
  console.log("roleImage: ", roleImage);
  return (
    <Link
      href={`/city/${event.organization.subdomain}/events/${event.path}/roles/${role.id}`}
      className="flex flex-col overflow-hidden rounded-lg"
    >
      <div className="relative rounded-lg border border-gray-200 pb-5 shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:hover:border-white">
        {roleImage ? (
          <div className="w-full">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={roleImage}
                alt={`${role.name} card image`}
                layout="fill"
              />
            </AspectRatio>
          </div>
        ) : null}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {role.name}
          </h3>
          <p className="text-gray-500 mt-2 line-clamp-1 text-sm font-normal leading-snug dark:text-gray-400">
            {role.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
