import { BarChart3, LineChart, Users } from 'lucide-react';

import { KpiCard } from '@/components/features/dashboard/kpi-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function AnalyticsPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const kpis = [
    {
      title: 'Conversion rate',
      value: '32.1%',
      changeLabel: '+4.3% month over month',
      trend: 'up' as const
    },
    {
      title: 'Usage by department',
      value: '7 active teams',
      changeLabel: 'Marketing, Finance, Support lead engagement',
      trend: 'flat' as const
    },
    {
      title: 'System throughput',
      value: '18.2k runs / day',
      changeLabel: '+11% week over week',
      trend: 'up' as const
    }
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Metric views</CardTitle>
            <CardDescription>
              Focus on the performance areas that matter to {subdomain}.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Conversion
            </Button>
            <Button variant="ghost" size="sm">
              Retention
            </Button>
            <Button variant="ghost" size="sm">
              Efficiency
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-dashed border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <LineChart className="h-4 w-4" /> Conversion rate trends
            </h3>
            <p className="mt-3 text-3xl font-semibold text-foreground">32.1%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Steady lift across the last quarter driven by nurture workflows.
            </p>
            <div className="mt-6 h-32 rounded-lg bg-primary/20" aria-hidden />
          </div>
          <div className="rounded-xl border border-dashed border-secondary/40 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent p-6">
            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="h-4 w-4" /> Usage by department
            </h3>
            <p className="mt-3 text-3xl font-semibold text-foreground">7 teams</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Marketing and Finance run the majority of automations this month.
            </p>
            <div className="mt-6 h-32 rounded-lg bg-secondary/20" aria-hidden />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Users className="h-4 w-4" /> Workspace adoption
          </CardTitle>
          <CardDescription>
            Track the velocity of user onboarding and key actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-foreground">Activation funnel</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1,204 users invited</li>
              <li>862 verified accounts</li>
              <li>612 completed first workflow setup</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Adoption milestones</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>78 percent enabled two-factor authentication</li>
              <li>56 percent automated more than three processes</li>
              <li>34 percent connected third-party integrations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
