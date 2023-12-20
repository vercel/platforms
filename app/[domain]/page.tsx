import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import prisma from "@/lib/prisma";
// import EventCard from "@/components/event-card";
import Link from "next/link";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Organization, Event } from "@prisma/client";
import SocialLandingPage from "@/components/site-layouts/social-media/social-landing-page";

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  // domain = domain.replace('%3A', ':');
  const domain = params.domain.replace("%3A", ":");
  // const session = await getSession();
  const [sitedata] = await Promise.all([getSiteData(domain)]);

  if (!sitedata) {
    notFound();
  }

  return <SocialLandingPage params={params} sitedata={sitedata} />;
}