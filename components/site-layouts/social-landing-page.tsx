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


export default function SocialLandingPage({
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
            <div className="h-10 w-full md:h-20"></div>
            <div className="px-5 py-3 md:py-8 ">
              <h1 className="mb-3 text-xl font-extrabold text-gray-800  dark:text-gray-200 md:text-2xl">
                {sitedata.name}
              </h1>
              <p className="mb-3 max-w-lg font-medium text-gray-800 dark:text-gray-350 tracking-[-0.02em]">{sitedata.description}</p>
              <SocialButtons citizens={24} visited={118} backers={32} />
              <div className="flex items-center">
                <div>
                  <AvatarGroup
                    avatars={[
                      { src: "", alt: "" },
                      { src: "", alt: "" },
                      { src: "", alt: "" },
                    ]}
                  />
                </div>
                <div className="mx-2 text-sm leading-tight text-gray-750 dark:text-gray-400">
                  Cassie, Tomas, Lily, and 12 others you know are citizens.
                </div>
              </div>
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
