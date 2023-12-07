import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import notFound from "../../not-found";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { UpdateCampaignSchema } from "@/lib/schema";
import { updateCampaign } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";


export default async function CampaignPage({
  params,
}: {
  params: { path: string; subdomain: string; id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: true,
      contributions: true,
    },
  });

  // const form = useForm<z.infer<typeof UpdateCampaignSchema>>({
  //   resolver: zodResolver(UpdateCampaignSchema),
  // });

  if (!campaign || !campaign.organization) {
    return notFound();
  }

  async function onSubmit(data: z.infer<typeof UpdateCampaignSchema>) {
    console.log("on Submit");

    const result = await updateCampaign(
      data,
      { params: { subdomain: params.subdomain as string } },
      null,
    );
    console.log(result);

    toast({
      title: "Campaign launched!"
    });
  }

  return (
    <div>
      <p>
        {campaign.name}
      </p>
      <p>
        {`threshold: ${campaign.threshold}`}
      </p>
      <p>
        {`content: ${campaign.content}`}
      </p>
      <p>
        {`created ${campaign.createdAt.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: undefined,
          timeZoneName: undefined
        })}`}
      </p>
      <p>
        {`last update ${campaign.updatedAt.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: undefined,
          timeZoneName: undefined
        })}`}
      </p>
      <p>
        {`deployed: ${campaign.deployed}`}
      </p>
      <p>
        {`timeDeployed: ${campaign.timeDeployed}`}
      </p>
      <p>
        {`deployedAddress: ${campaign.deployedAddress}`}
      </p>
      <p>
        {`sponsorEthAddress: ${campaign.sponsorEthAddress}`}
      </p>
      <p>
        {`contributions: ${campaign.contributions}`}
      </p>
      <p>
        {`organization: ${campaign.organization.name}`}
      </p>
    </div>
    // <Form {...form}>
    //   <form
    //     onSubmit={form.handleSubmit(onSubmit)}
    //     className="w-full space-y-6 rounded-md bg-gray-200/80 px-6 py-6 backdrop-blur-lg  dark:bg-gray-900/80 md:max-w-md md:border md:border-gray-200 md:shadow dark:md:border-gray-700"
    //   >
    //     <FormField
    //       control={form.control}
    //       name="name"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Property Name</FormLabel>
    //           <Input {...field} />
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <div>
    //       <FormLabel>Address</FormLabel>
    //       <GeocodeInput />
    //     </div>
    //     <PrimaryButton loading={pending} type="submit">
    //       Submit
    //     </PrimaryButton>
    //   </form>
    // </Form>
  );
}