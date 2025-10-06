import { Filter, Plus } from 'lucide-react';

import { WorkflowTable } from '@/components/features/workflows/workflow-table';
import type { WorkflowAuditEvent } from '@/components/features/workflows/workflow-audit-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function WorkflowsPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const subdomainPath = `/s/${subdomain}`;

  const auditTrail: WorkflowAuditEvent[] = [
    {
      id: 'a-1',
      step: 'Webhook received',
      status: 'Completed',
      timestamp: 'Mar 18, 2025 09:14 UTC'
    },
    {
      id: 'a-2',
      step: 'Payload validation',
      status: 'Completed',
      timestamp: 'Mar 18, 2025 09:15 UTC'
    },
    {
      id: 'a-3',
      step: 'CRM sync',
      status: 'Failed',
      timestamp: 'Mar 18, 2025 09:16 UTC',
      notes: 'Rate limited by upstream system'
    }
  ];

  const workflows = [
    {
      id: 'wf-1',
      name: 'Lead enrichment',
      owner: 'Sara Collins',
      lastRun: 'Mar 18, 2025 09:16 UTC',
      status: 'failed' as const,
      events: auditTrail
    },
    {
      id: 'wf-2',
      name: 'Weekly reporting sync',
      owner: 'Operations Team',
      lastRun: 'Mar 17, 2025 18:07 UTC',
      status: 'success' as const,
      events: auditTrail.slice(0, 2)
    },
    {
      id: 'wf-3',
      name: 'Invoice reconciliation',
      owner: 'Finance',
      lastRun: 'Mar 18, 2025 05:32 UTC',
      status: 'running' as const,
      events: auditTrail.slice(0, 1)
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Workflow orchestration</CardTitle>
            <CardDescription>
              Create, monitor, and retry workflows that power your business.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Use filters to focus on pending approvals, failed runs, or owners.</p>
          <p>Workflow retries preserve the original payload and execution context.</p>
          <p>Audit trails capture every step to simplify compliance reviews.</p>
        </CardContent>
      </Card>

      <WorkflowTable workflows={workflows} subdomainPath={subdomainPath} />
    </div>
  );
}
