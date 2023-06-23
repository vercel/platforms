import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import ProfileButton from "./profile-button";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <ProfileButton session={session} />;
}
