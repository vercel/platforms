import { getCitizensWithMutualEventAttendance } from "@/lib/actions";
import AvatarGroup from "./avatar-group";
import { getSession } from "@/lib/auth";
import { Organization } from "@prisma/client";

function generateAvatarGroupAndSentence(
  prevMutualAttendees: {
    name: string | null;
    ens_name: string | null;
    image: string | null;
    id: string;
  }[],
) {
  // Limit to 3 attendees for the avatar group
  const attendeesForAvatar = prevMutualAttendees.slice(0, 3);

  // Generate the sentence
  const othersCount = prevMutualAttendees.length - 3;
  const attendeeNames = attendeesForAvatar
    .map((attendee) => attendee.name || attendee.ens_name)
    .join(", ");
  const sentence = `${attendeeNames}${
    othersCount > 0 ? `, and ${othersCount} others` : "0 people"
  } you know are citizens.`;

  // Generate the avatar group
  const avatarGroup = (
    <AvatarGroup
      avatars={attendeesForAvatar.map((attendee) => ({
        src: attendee.image || "",
        alt: attendee.name || attendee.ens_name || "",
      }))}
    />
  );

  return { avatarGroup, sentence };
}

export default async function MutualAttendenceCitizens({
  organization,
}: {
  organization: Organization;
}) {
  const session = await getSession();
  const loggedInId = session?.user.id;
  if (!loggedInId) {
    return (
      <div className="flex items-center">
        <div>
          <AvatarGroup
            avatars={[
              { src: "", alt: "" },
              { src: "", alt: "" },
            ]}
          />
        </div>
        <div className="mx-2 text-sm leading-tight text-gray-750 dark:text-gray-400">
          Connect to see mutual attendees.
        </div>
      </div>
    );
  }

  const prevMutualAttendees = await getCitizensWithMutualEventAttendance(
    loggedInId,
    organization.id,
  );
  const { avatarGroup, sentence } =
    generateAvatarGroupAndSentence(prevMutualAttendees);

  return (
    <div className="flex items-center">
      <div>{avatarGroup}</div>
      <div className="mx-2 text-sm leading-tight text-gray-750 dark:text-gray-400">
        {sentence}
      </div>
    </div>
  );
}
