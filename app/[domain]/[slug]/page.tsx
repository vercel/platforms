import { notFound } from "next/navigation";
// import { getPostData } from "@/lib/fetchers";
// import { placeholderBlurhash, toDateString } from "@/lib/utils";
import Event from "@/components/event";
import {
  getEventData,
  getEventRolesAndUsers,
  getEventTicketTiers,
} from "@/lib/actions";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const { slug } = params;
  const domain = params.domain.replace("%3A", ":");
  const event = await getEventData(slug, domain);
  if (!event) {
    return null;
  }
  const { name, description } = event;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      creator: event.organization.name,
    },
  };
}

export default async function SiteEventPage({
  params,
}: {
  params: { domain: string; slug: string };
}) {
  const domain = params.domain.replace("%3A", ":");
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  if (!subdomain) {
    notFound();
  }
  // Fetch the event data
  const event = await getEventData(params.slug, subdomain || domain);
  if (!event) {
    notFound();
  }

  const [rolesAndUsers, ticketTiers] = await Promise.all([
    getEventRolesAndUsers(event.id),
    getEventTicketTiers(event.id),
  ]);

  return (
    <div className="px-4 pt-4 pb-20">
      <Event
        event={event}
        rolesAndUsers={rolesAndUsers}
        ticketTiers={ticketTiers}
      />
    </div>
  );
}
