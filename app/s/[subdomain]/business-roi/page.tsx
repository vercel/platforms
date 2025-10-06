import {
  ArrowRight,
  CalendarClock,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { ChartAreaInteractive } from "@/components/features/dashboard/chart-area-interactive";
import { DataTable } from "@/components/features/dashboard/data-table"
import { SectionCards } from "@/components/features/dashboard/section-cards"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import data from "@/components/features/dashboard/data.json"


export default async function DashboardPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainPath = `/s/${subdomain}`;


  return (
    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
  );
}
