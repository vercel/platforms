import { AspectRatio } from "@/components/ui/aspect-ratio";
import OrganizationPagePrimaryButton from "./organization-page-primary-button";
import { LineGradient } from "@/components/line-gradient";
import { OrganizationPageLinks } from "@prisma/client";
import Image from "next/image";
import HeaderMainTitle from "./header-main-title";
import HeaderMainDescription from "./header-main-description";

export default function SocialHeaderMain({
  logo,
  name,
  description,
  primaryLink,
}: {
  logo?: string;
  name?: string;
  description?: string;
  primaryLink?: OrganizationPageLinks;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col">
      <div className="relative flex h-10 w-full justify-end md:h-16">
        <div className="absolute -top-10 left-5 h-20  w-20 overflow-hidden rounded-b-3xl rounded-t-3xl md:-top-16 md:left-5 md:h-32 md:w-32">
          {logo ? (
            <AspectRatio ratio={1 / 1} className="w-full ">
              <Image
                src={logo}
                alt={`${name} logo` ?? "logo image"}
                fill
                className="object-cover"
              />
            </AspectRatio>
          ) : null}
        </div>

        <OrganizationPagePrimaryButton pageLink={primaryLink} />
      </div>
      <div className="px-5 py-3 md:py-4 ">
        <HeaderMainTitle>{name}</HeaderMainTitle>
        <HeaderMainDescription>{description}</HeaderMainDescription>
        {/* <SocialButtons sitedata={sitedata} /> */}
        {/* <MutualAttendenceCitizens organization={sitedata} /> */}
      </div>

      <LineGradient />
    </div>
  );
}
