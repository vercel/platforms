import Link from "next/link";
// import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function RegistrationCardLink({
  eventPath,
  ticketTierId,
  children,
  ...rest
}: {
  eventPath: string;
  ticketTierId: string;
  children: ReactNode;
}) {
  // const pathname = useRouter();
  const href = `/${eventPath}/apply/${ticketTierId}`;

  return (
    <Link
      href={href}
      key={ticketTierId}
      {...rest}
    >
      {children}
    </Link>
  );
}
