import EventSettings from '@/app/app/(dashboard)/city/[subdomain]/events/[path]/settings/page'

export default async function SiteEventSettingsPage({
    params,
  }: {
    params: { path: string; domain: string };
  }) {
    return <EventSettings params={{ path: params.path, subdomain: params.domain }} />
}