import CreatePlaceModal from "@/components/modal/create-place-form";
import OpenModalButton from "@/components/open-modal-button";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import prisma from "@/lib/prisma";
import NotFoundCity from "../not-found";
import HousingNav from "./nav";

export default async function HousingPage({
  params,
  children,
}: {
  params: { subdomain: string };
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user.id) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-xl font-bold dark:text-white sm:text-3xl">
          You need to be logged in to view this page.
        </h1>
      </div>
    );
  }

  const org = await prisma.organization.findFirst({
    where: {
      subdomain: params.subdomain,
    },
    include: {
      places: true,
    },
  });

  if (!org) {
    return <NotFoundCity />;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 py-8 lg:p-8 md:flex">
      <DashboardHeader
        title="Housing"
        ActionButton={
          <OpenModalButton text="Add Property">
            <CreatePlaceModal />
          </OpenModalButton>
        }
      />
      <HousingNav />
      {children}
    </div>
  );
}
