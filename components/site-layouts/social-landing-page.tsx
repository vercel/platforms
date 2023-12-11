import { Organization, OrganizationPageLinks } from "@prisma/client";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import SiteNav from "../site-nav";
import SocialLandingPageFeed from "./social-landing-page-feed";
import SocialButtons from "./social-buttons";
import { LineGradient } from "../line-gradient";
// import { getUsersWithRoleInOrganization } from "@/lib/actions";
import MutualAttendenceCitizens from "./mutual-attendance-citizens";
// import PrimaryButton from "../primary-button";
import { Button } from "../ui/button";
import Link from "next/link";
import OrganizationPageLinksGrid from "./organization-page-links-grid";
import OrganizationPagePrimaryButton from "./organization-page-primary-button";

// Replace 'mySubdomain' with the actual subdomain of your organization

export default async function SocialLandingPage({
  sitedata,
  params,
}: {
  sitedata: Organization & { pageLinks: OrganizationPageLinks[] };
  params: { domain: string };
}) {
  let primaryPageLink: OrganizationPageLinks | undefined;
  const nonPrimaryPageLinks = sitedata.pageLinks.filter((pageLink) => {
    if (pageLink.isPrimary) {
      primaryPageLink = pageLink;
      return false;
    }
    return true;
  });

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
            <div className="relative flex h-10 w-full justify-end md:h-16">
              <div className="absolute -top-10 left-5 h-20  w-20 overflow-hidden rounded-b-3xl rounded-t-3xl md:-top-16 md:left-5 md:h-32 md:w-32">
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

              <OrganizationPagePrimaryButton pageLink={primaryPageLink} />
            </div>
            <div className="px-5 py-3 md:py-4 ">
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
      <OrganizationPageLinksGrid pageLinks={sitedata.pageLinks} />
      <SocialLandingPageFeed params={params} sitedata={sitedata} />
    </>
  );
}
