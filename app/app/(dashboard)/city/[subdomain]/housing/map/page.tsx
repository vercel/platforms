import NotFoundCity from "../../not-found";
import HousingMap from "./housing-map";
import prisma from "@/lib/prisma";

export default async function HousingPage({
  params,
}: {
  params: { subdomain: string };
}) {
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
    <div className="flex flex-col space-y-6">
      <HousingMap places={org.places} />
    </div>
  );
}
