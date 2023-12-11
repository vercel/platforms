import { Campaign, Organization } from "@prisma/client";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

const getPlaceholderImage = (campaign: Campaign) => {
  // @ts-ignore
  // if (form?.image) {
  //   // @ts-ignore
  //   return form?.image as string;
  return undefined;
  // Add your own logic for placeholder images based on form
};

export default function CampaignCard({
  campaign,
  name,
  threshold,
  organization,
}: {
  campaign: Campaign;
  name: string;
  threshold: bigint;
  organization: Organization;
}) {
  const campaignImage = getPlaceholderImage(campaign);
  return (
    <Card className="overflow-hidden">
      <Link href={`/city/${organization.subdomain}/campaigns/${campaign.id}`}>
        <div className="h-40  p-6">
          <CardTitle>{campaign.name}</CardTitle>

          {campaignImage ? (
            <div className="w-full">
              <AspectRatio ratio={1 / 1}>
                <Image
                  src={campaignImage}
                  alt={`${campaign.id} card image`}
                  layout="fill"
                />
              </AspectRatio>
            </div>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}
