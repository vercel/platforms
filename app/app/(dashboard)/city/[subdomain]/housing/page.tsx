import DashboardHeader from "@/components/dashboard-header";
import prisma from "@/lib/prisma";
import NotFoundCity from "../not-found";
import { Card } from "@/components/ui/card";
import PrimaryButton from "@/components/primary-button";
import PropertiesCards from "@/components/properties-cards";

export default async function HousingPageCard({
  params,
}: {
  params: { subdomain: string };
}) {
  const org = await prisma.organization.findFirst({
    where: {
      subdomain: params.subdomain,
    },
    include: {
      places: {
        include: {
          accommodationUnit: true
        }
      },
    },
  });

  if (!org) {
    return <NotFoundCity />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <PropertiesCards properties={org.places} />
    </div>
  );
}
