import { Event, TicketTier, Organization, Role } from "@prisma/client";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

const getPlaceholderImage = (tier: TicketTier) => {
  // @ts-ignore
  if (tier?.image) {
    return tier?.name;
  }
  // Add your own logic for placeholder images based on tier name
};

export default function TicketTierCard({
  ticketTier,
  role,
  event,
  organization,
}: {
  ticketTier: TicketTier;
  role: Role;
  event: Event;
  organization: Organization;
}) {
  const tierImage = getPlaceholderImage(ticketTier);
  return (
    <div
    // <Link
    //   href={`/city/${organization.subdomain}/events/${event.path}/tickets/${ticketTier.id}`}
      className="flex flex-col overflow-hidden rounded-lg dark:hover:border-white"
    >
      <div className="relative rounded-lg border border-gray-200 pb-5 shadow-md transition-all hover:shadow-xl dark:border-gray-700 dark:hover:border-white">
        {tierImage ? (
          <div className="w-full">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={tierImage}
                alt={`${ticketTier.name} card image`}
                layout="fill"
              />
            </AspectRatio>
          </div>
        ) : null}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <h3 className="my-0 truncate font-cal text-xl font-bold tracking-wide dark:text-white">
            {ticketTier.name}
          </h3>
          <p className="text-gray-500 mt-2 line-clamp-1 text-sm font-normal leading-snug dark:text-gray-400">
            {ticketTier?.description}
          </p>
        </div>
      </div>
    {/* </Link> */}
    </div>
  );
}
