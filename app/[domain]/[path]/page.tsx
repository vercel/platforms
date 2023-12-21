import { notFound } from "next/navigation";
import Event from "@/components/event-page";
import {
  getEventData,
  getEventRolesAndUsers,
  getEventTicketTiers,
} from "@/lib/actions";
import { getSession } from "@/lib/auth";

export async function generateMetadata({
  params,
}: {
  params: { domain: string; path: string };
}) {
  const { path } = params;
  const domain = params.domain.replace("%3A", ":");
  const event = await getEventData(path, domain);
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
  params: { domain: string; path: string };
}) {
  const domain = params.domain.replace("%3A", ":");
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  if (!subdomain) {
    notFound();
  }
  // Fetch the event data
  const [event, session] = await Promise.all([
    getEventData(params.path, subdomain || domain),
    getSession(),
  ]);

  if (!event) {
    notFound();
  }

  const [rolesAndUsers, ticketTiers] = await Promise.all([
    getEventRolesAndUsers(event.id),
    getEventTicketTiers(event.id),
  ]);

  return (
    <div className="px-4 pb-20 pt-4">
      <Event
        event={event}
        rolesAndUsers={rolesAndUsers}
        ticketTiers={ticketTiers}
        userSession={session || undefined}
      />
    </div>
  );
}
