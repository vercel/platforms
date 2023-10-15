import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { placeholderBlurhash } from "@/lib/utils";
import Image from "next/image";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: true,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            {event.name}
          </h1>
        </div>
        <div className="mt-20 flex flex-col items-center space-x-4">
          <h6 className="font-cal text-4xl">{event.description}</h6>
          <Image
            alt={event.name ?? "Event thumbnail"}
            width={500}
            height={400}
            className="h-44 object-cover"
            src={event.image ?? "/placeholder.png"}
            placeholder="blur"
            blurDataURL={event.imageBlurhash ?? placeholderBlurhash}
          />
        </div>
      </div>
    </div>
  );
}
