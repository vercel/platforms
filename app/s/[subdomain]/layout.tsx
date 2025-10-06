import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BusinessShell from '@/components/features/business/business-shell';
import { getSubdomainData } from '@/lib/subdomains';
import { rootDomain } from '@/lib/utils';

export async function generateMetadata({
  params
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    return {
      title: rootDomain
    };
  }

  return {
    title: `${subdomain}.${rootDomain}`,
    description: `Business dashboard for ${subdomain}.${rootDomain}`
  };
}

export default async function SubdomainLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainData = await getSubdomainData(subdomain);

  if (!subdomainData) {
    notFound();
  }


  return (
    <BusinessShell subdomain={subdomain} emoji={subdomainData.emoji}>
      {children}
    </BusinessShell>
  );
}
