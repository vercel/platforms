import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageHeader from "@/components/dashboard-header";
import OpenModalButton from "@/components/open-modal-button";
import CampaignEditorModal from "@/components/campaign-editor-modal";
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

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title="Campaigns"
        ActionButton={
          <OpenModalButton text="New Campaign">
            <CampaignEditorModal />
          </OpenModalButton>
        }
      />
      {/* <Campaigns
        organization={organization}
        forms={campaigns}
      /> */}
    </div>
  );
}