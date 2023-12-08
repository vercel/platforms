import { Organization } from "@prisma/client";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import SiteNav from "../site-nav";
import ConnectPassportButton from "../buttons/ConnectPassportButton";
import LandingPageTabs from "./landing-page-tabs";
import SocialLandingPageFeed from "./social-landing-page-feed";
import AvatarGroup from "./avatar-group";
import SocialButtons from "./social-buttons";
import { LineGradient } from "../line-gradient";
import { getUsersWithRoleInOrganization } from "@/lib/actions";
import MutualAttendenceCitizens from "./mutual-attendance-citizens";
import PrimaryButton from "../primary-button";
import { Button } from "../ui/button";
import Link from "next/link";

// Replace 'mySubdomain' with the actual subdomain of your organization

export default async function SocialLandingPage({
  sitedata,
  params,
}: {
  sitedata: Organization;
  params: { domain: string };
}) {
  return (
    <>
      <SiteNav params={{ domain: sitedata.subdomain as string }} />
      <div className="relative w-full rounded-lg transition-all dark:border-gray-700 dark:hover:border-white">
        <div className="flex flex-col items-center">
          <div className="mx-auto w-full max-w-5xl overflow-hidden md:rounded-3xl">
            {sitedata.image ? (
              <AspectRatio ratio={3 / 1} className="w-full">
                <Image
                  src={sitedata.image}
                  alt={`${sitedata?.name} Hero Image` ?? "Hero Image"}
                  blurDataURL={sitedata?.imageBlurhash ?? undefined}
                  fill
                  className="object-cover"
                />
              </AspectRatio>
            ) : null}
          </div>
          <div className="relative mx-auto flex w-full max-w-5xl flex-col">
            <div className="relative flex h-10 w-full justify-end">
              <div className="absolute -top-10 left-5 h-20  w-20 overflow-hidden rounded-b-3xl rounded-t-3xl md:-top-20 md:left-5 md:h-40 md:w-40">
                {sitedata.logo ? (
                  <AspectRatio ratio={1 / 1} className="w-full ">
                    <Image
                      src={sitedata.logo}
                      alt={`${sitedata?.name} logo` ?? "logo image"}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                ) : null}
              </div>

              <Button
                className="absolute -bottom-5 mx-5 h-8 md:-bottom-10 md:mx-10"
                asChild
              >
                <Link href="/apply">Apply to Join</Link>
              </Button>
            </div>
            <div className="px-5 py-3 md:py-8 ">
              <h1 className="mb-3 text-2xl font-extrabold text-gray-800  dark:text-gray-200 md:text-3xl">
                {sitedata.name}
              </h1>
              <p className="mb-3 max-w-lg font-medium tracking-[-0.02em] text-gray-800 dark:text-gray-350">
                {sitedata.description}
              </p>
              <SocialButtons sitedata={sitedata} />
              <MutualAttendenceCitizens organization={sitedata} />
            </div>

            <LineGradient />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl pt-3">
        <LandingPageTabs params={params} />
      </div>
      <SocialLandingPageFeed params={params} sitedata={sitedata} />
    </>
  );
}
