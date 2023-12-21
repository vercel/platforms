import { placeholderBlurhash } from "@/lib/utils";
import {
  Event,
  Organization,
  Role,
  TicketTier,
  User,
  UserRole,
} from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import {
  convertNameToTwoLetters,
  getTwoLetterPlaceholder,
  getUsername,
} from "@/lib/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegistrationCardItems } from "./registration-card-items";
import { ExternalLink } from "lucide-react";
import BannerImage from "./site-layouts/social-media/banner-image";
import SocialHeaderMain from "./site-layouts/social-media/social-header-main";
import HeaderMainTitle from "./site-layouts/social-media/header-main-title";
import HeaderMainDescription from "./site-layouts/social-media/header-main-description";
import { LineGradient } from "./line-gradient";
import { Button } from "./ui/button";
import { getSession } from "@/lib/auth";
import { Session } from "next-auth";
import { format } from "date-fns";
import { EventHost } from "./event-list";

function CalendarView({ startingAt }: { startingAt: Date }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-300">
      <div className="bg-gray-300 text-center">
        <span className="md:text-md px-3 text-sm font-semibold md:px-4">
          {format(startingAt, "MMM")}
        </span>
      </div>
      <div className="px-2 py-0.5 text-center md:px-4">
        <span className="md:text-md text-sm font-bold">
          {format(startingAt, "d")}
        </span>
      </div>
    </div>
  );
}

function TimeDisplay({
  startingAt,
  endingAt,
}: {
  startingAt: Date;
  endingAt: Date;
}) {
  return (
    <div className="my-1">
      <div className="mb-1 space-x-2">
        <span className="text-md font-semibold tracking-tight text-gray-900 dark:text-gray-100 lg:text-lg">
          {format(startingAt, "EEEE, MMMM d, yyyy")}
        </span>
      </div>
      <div className="space-x-2">
        <span className="lg:text-md text-sm font-medium text-gray-750 dark:text-gray-250">
          {format(startingAt, "h:mm a")} to {format(endingAt, "MMM d, h:mm a")}{" "}
        </span>
      </div>
    </div>
  );
}

type RolesAndUsers = {
  user: User;
  role: Role;
} & UserRole;

export function HostUser({ user }: { user: User }) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        {user?.image ? <AvatarImage src={user.image} /> : null}
        <AvatarFallback>{getTwoLetterPlaceholder(user)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-md font-semibold leading-none">{user.name}</p>
        {/* <p className="text-muted-foreground text-sm">{getUsername(user)}</p> */}
      </div>
    </div>
  );
}

export function HostsCard({
  hostUsers,
  userIsHost,
  settingsUrl,
}: {
  hostUsers: RolesAndUsers[];
  userIsHost?: boolean;
  settingsUrl?: string;
}) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Hosted by</CardTitle>
        {/* <CardDescription>
          Invite your team members to collaborate.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-6">
        {hostUsers.map((hostUser) => (
          <HostUser key={hostUser.id} user={hostUser.user} />
        ))}
      </CardContent>
      {userIsHost && settingsUrl ? (
        <CardFooter className="flex items-center justify-between">
          <span className="mr-2">You are a host</span>
          <Button asChild>
            <Link href={settingsUrl}>Event Settings</Link>
          </Button>
        </CardFooter>
      ) : null}
      <LineGradient />
    </div>
  );
}

export function HostedByInline({ users }: { users: EventHost[] }) {
  return (
    <div className="flex items-center">
      <div className="flex space-x-2">
        {users.map((hostUser, index) => (
          <Avatar key={hostUser.id}>
            {hostUser.image ? <AvatarImage src={hostUser.image} /> : null}
          </Avatar>
        ))}
      </div>
      <span className="mx-1.5">By </span>
      <div className="flex space-x-1">
        {users.map((hostUser, index) => (
          <span key={hostUser.id}>
            {hostUser.name}
            {index < users.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutCard({ event }: { event: Event }) {
  console.log("event.description", event.description);
  return (
    <div>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <HeaderMainDescription>
          {event?.description ? event.description : undefined}
        </HeaderMainDescription>
      </CardContent>
    </div>
  );
}

type RegistrationCardProps = {
  ticketTiers: (TicketTier & { role: Role; _count: { tickets: number } })[];
  event: Event & { organization: Organization };
};

export function RegistrationCard({
  ticketTiers,
  event,
}: RegistrationCardProps) {
  if (!ticketTiers || !(ticketTiers.length > 0)) {
    return null;
  }
  const TitleCopy = (() => {
    // TODO:// Remove hardcoded event id
    // if (event.id === VITALIA_2024_EVENT) {
    //   return <Link href="https://lu.ma/vitalia" className="hover:underline">Register Externally↗</Link>;
    // }

    if (!ticketTiers || !(ticketTiers.length > 0)) {
      return "Registration options are not yet public";
    }

    return "Registration Options";
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{TitleCopy}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ticketTiers.map((ticketTier) => (
          <RegistrationCardItems
            key={ticketTier.id}
            ticketTier={ticketTier}
            event={event}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function isUserHost(
  userId: string,
  hostUsers: RolesAndUsers[],
): boolean {
  console.log("userId: ", userId, hostUsers);
  return hostUsers.some((hostUser) => hostUser.user.id === userId);
}

export default function EventPage({
  event,
  rolesAndUsers,
  ticketTiers,
  userSession,
}: {
  event: Event & { organization: Organization };
  rolesAndUsers: RolesAndUsers[];
  ticketTiers: (TicketTier & { role: Role; _count: { tickets: number } })[];
  userSession?: Session;
}) {
  const uniqueUsers = useMemo(
    () =>
      Array.from(
        new Map(
          rolesAndUsers.map((item) => [item.user.id, item.user]),
        ).values(),
      ),
    [rolesAndUsers],
  );
  const uniqueRoles = useMemo(
    () =>
      Array.from(
        new Map(
          rolesAndUsers.map((item) => [item.role.id, item.role]),
        ).values(),
      ),
    [rolesAndUsers],
  );

  const hostUsers = useMemo(
    () => rolesAndUsers.filter((ru) => ru.role.name === "Host"),
    [rolesAndUsers],
  );

  const userIsHost = userSession
    ? isUserHost(userSession.user.id, hostUsers)
    : false;

  console.log("userIsHost", userIsHost);

  return (
    <>
      <div className="h-14 w-full" />
      <div className="relative flex w-full  max-w-5xl flex-col items-center  space-y-6 md:px-8">
        <BannerImage
          alt={event.name ?? "Event thumbnail"}
          src={event.image ?? "/placeholder.png"}
          blurDataURL={event.imageBlurhash ?? placeholderBlurhash}
        />
        <div className="w-full">
          <div className="flex flex-col items-start">
            <div className="my-2 px-6 md:px-6">
              <HeaderMainTitle>{event.name}</HeaderMainTitle>
              <HostedByInline users={hostUsers.map(({ user }) => user)} />
            </div>
            <div className="p-4 md:px-6 md:pb-4">
              {event.startingAt && event.endingAt && (
                <div className="flex space-x-4">
                  <CalendarView startingAt={event.startingAt} />
                  <TimeDisplay
                    startingAt={event.startingAt}
                    endingAt={event.endingAt}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 mx-auto flex w-full flex-col space-y-6 lg:col-span-2">
            <AboutCard event={event} />
          </div>
          {/* <RegistrationCard event={event} ticketTiers={ticketTiers} /> */}
          <div className="col-span-1 space-y-6">
            <HostsCard
              hostUsers={hostUsers}
              userIsHost={userIsHost}
              settingsUrl={`/${event.path}/settings`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function EventPageOrganization({ org }: { org: Organization }) {
  return (
    <div className="mt-2 flex items-center space-x-3">
      <Avatar className="h-5 w-5">
        {org?.logo ? <AvatarImage src={org.logo} /> : null}
      </Avatar>
      <h3 className="font-medium uppercase">{org.name}</h3>
    </div>
  );
}
