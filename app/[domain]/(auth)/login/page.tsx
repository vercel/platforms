import AuthModal from "@/components/auth-modal";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SiteLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <AuthModal />;
}
