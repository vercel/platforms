import prisma from "@/lib/prisma";
import NotFoundCity from "../not-found";
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
          accommodationUnit: {
            include: {
              rooms: {
                include: {
                  beds: true
                }
              }
            }
          }
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
