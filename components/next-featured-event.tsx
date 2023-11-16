import prisma from "@/lib/prisma";
import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import CountdownTimer from "./countdown-timer";
import { format } from "date-fns";

export default async function NextFeaturedEvent() {
  const featuredEvents = await prisma.event.findMany({
    where: {
      startingAt: {
        gt: new Date(), // only get events where the date is greater than the current date
      },
      isFeatured: true,
    },
    orderBy: {
      startingAt: "asc", // order by date in ascending order
    },
  });

  console.log("featuredEvents: ", featuredEvents);
  if (!featuredEvents || !(featuredEvents.length > 0)) {
    return null;
  }

  const nextEvent = featuredEvents[0];

  return (
    <div className="grid grid-flow-col">
      <div className="col-span-1 flex flex-col space-y-2 p-8">
        <div className="flex  w-full max-w-3xl flex-col items-baseline justify-between rounded-lg">
          <div className="text-sm font-mono font-semibold uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300">
            Next Pop-Up City
          </div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
            {nextEvent.startingAt && (
              <CountdownTimer targetDate={nextEvent.startingAt} />
            )}
          </h1>
        </div>
        <div className="w-full max-w-3xl rounded-lg">
          <AspectRatio ratio={2 / 1}>
            {nextEvent.image ? (
              <Image
                fill
                className="rounded-lg object-cover"
                src={nextEvent.image}
                alt={`Banner Image for ${nextEvent.name}`}
              />
            ) : null}
          </AspectRatio>
        </div>

        <div className="mt-4 flex w-full max-w-3xl flex-col justify-between rounded-lg text-2xl font-medium lg:flex-row">
          <h1 className="text-2xl  font-semibold text-gray-800 dark:text-gray-200">
            {nextEvent.name}
          </h1>
          <div className="flex flex-col lg:items-end mt-2 lg:mt-0 font-serif font-light text-xl text-gray-800 dark:text-gray-200">
            <div>
              {nextEvent.startingAt &&
                format(nextEvent.startingAt, "EEEE, MMMM d, yyyy")}
            </div>
            <div>
              {"to "}
              {nextEvent.endingAt && format(nextEvent.endingAt, "EEEE, MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
