import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/dashboard-header";
import ConnectEthButton from "@/components/connect-eth-button";
import CreateCampaignButton from "@/components/create-campaign-button";
import prisma from "@/lib/prisma";
import notFound from "../not-found";
// import CreateEventFormButton from "@/components/create-form-button";
// import OrgForms from "@/components/org-forms";

export default async function CampaignsPage({
  params,
}: {
  params: { path: string; subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const organization = await prisma.organization.findFirst({
    where: {
      subdomain: params.subdomain,
    },
  });

  if (!organization) {
    return notFound();
  }

  // const campaigns = await prisma.campaign.findMany({
  //   where: {
  //     organizationId: organization.id,
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     published: true,
  //     organizationId: true,
  //     eventId: true,
  //     image: true,
  //     questions: true,
  //     role: true,
  //     endingTitle: true,
  //     endingDescription: true,
  //     formResponse: {
  //       select: {
  //         id: true
  //       },
  //     }
  //   }
  // });
  const btn = <div>Not a button</div>

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Campaigns"
        ActionButton={
          <CreateCampaignButton />
        }
      />
      {/* <ConnectEthButton /> */}
      {/* <Campaigns
        organization={organization}
        forms={campaigns}
      /> */}
    </div>
  );
}