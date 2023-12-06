import { Organization } from "@prisma/client";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import SiteNav from "../site-nav";
import ConnectPassportButton from "../buttons/ConnectPassportButton";

export default function SocialLandingPage({
  sitedata,
}: {
  sitedata: Organization;
}) {
  return (
    <>
      <SiteNav params={{ domain: sitedata.subdomain as string }} />
      <div className="relative w-full rounded-lg transition-all dark:border-gray-700 dark:hover:border-white">
        <div className="flex flex-col items-center">
          {/* <div className="p-10 md:w-1/2 xl:px-20">
        <h1 className="font-serif text-3xl font-semibold lg:text-5xl xl:text-6xl">
          {sitedata.header}
        </h1>
        <p className="mt-4 text-xl">{sitedata.description}</p>
      </div> */}
          <div className="mx-auto w-full max-w-5xl overflow-hidden md:rounded-3xl">
            {sitedata.image ? (
              <AspectRatio ratio={2.2 / 1} className="w-full">
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
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
            <div className="absolute -top-10  h-20 w-20 overflow-hidden rounded-b-3xl rounded-t-[5rem] md:-top-20 md:h-40 md:w-40">
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
            <div>
              <h1 className="mx-[calc(5rem/(3))] my-3 text-2xl font-bold text-gray-800  dark:text-gray-350  md:mx-[calc(5rem/(3/2))] md:my-8 md:text-4xl">
                {sitedata.name}
              </h1>
              <p>{sitedata.description}</p>
            </div>
            <div className="from h-[0.5px] w-full bg-gradient-to-r from-gray-500/10 via-gray-500/90 to-gray-500/10 px-5" />
          </div>
        </div>
      </div>
    </>
  );
}
