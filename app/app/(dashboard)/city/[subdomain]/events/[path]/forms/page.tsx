import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/dashboard-header";
import prisma from "@/lib/prisma";
import notFound from "../not-found";
import EventForms from "@/components/event-forms";
import CreateEventFormButton from "@/components/create-form-button";

export default async function EventFormsPage({
  params,
}: {
  params: { path: string; subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

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

  const forms = await prisma.form.findMany({
    where: {
      eventId: event.id,
    },
    select: {
      id: true,
      name: true,
      published: true,
      organizationId: true,
      eventId: true,
      image: true,
      questions: true,
      endingTitle: true,
      endingDescription: true,
      role: true,
      formResponse: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Event Forms"
        ActionButton={<CreateEventFormButton />}
      />
      <EventForms
        organization={event.organization}
        event={event}
        forms={forms}
      />
    </div>
  );
}
