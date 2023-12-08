import Image from "next/image";
import { QuestionMarkIcon } from "@radix-ui/react-icons";

export default function AvatarGroup({
  avatars,
}: {
  avatars: { src?: string; alt?: string }[];
}) {
  return (
    <div className="flex -space-x-4 overflow-hidden">
      {avatars.slice(0, 3).map((avatar, index) => (
        <div
          key={avatar.src}
          className="relative inline-block h-10 w-10 rounded-full border-2 border-gray-100 bg-gray-500 dark:border-gray-900"
        >
          {avatar.src ? (
            <Image
              className="rounded-full object-cover"
              src={avatar.src}
              alt={avatar.alt ?? "Avatar"}
              width={40}
              height={40}
            />
          ) : (
              <QuestionMarkIcon height={20} width={20} className="m-2 stroke-gray-650" />
          )}
          {index === 2 && avatars.length > 3 ? (
            <span className="absolute bottom-0 right-0 rounded-full bg-gray-500 px-1 text-xs text-white">
              +{avatars.length - 3}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
