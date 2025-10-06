import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { WorkflowStatusBadge } from './workflow-status-badge';
import type { WorkflowAuditEvent } from './workflow-audit-dialog';
import { WorkflowAuditDialog } from './workflow-audit-dialog';

type WorkflowRow = {
  id: string;
  name: string;
  owner: string;
  lastRun: string;
  status: 'success' | 'running' | 'failed' | 'queued';
  events: WorkflowAuditEvent[];
};

type WorkflowTableProps = {
  workflows: WorkflowRow[];
  subdomainPath: string;
};

export function WorkflowTable({ workflows, subdomainPath }: WorkflowTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Workflow runs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor latest executions and retry failures as needed.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button asChild size="sm">
            <Link href={`${subdomainPath}/workflows/new`}>New workflow</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-2 font-medium">Workflow</th>
              <th className="px-4 py-2 font-medium">Owner</th>
              <th className="px-4 py-2 font-medium">Last run</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((workflow) => (
              <tr key={workflow.id} className="rounded-xl bg-card">
                <td className="rounded-l-xl px-4 py-3 font-medium text-foreground">
                  {workflow.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{workflow.owner}</td>
                <td className="px-4 py-3 text-muted-foreground">{workflow.lastRun}</td>
                <td className="px-4 py-3">
                  <WorkflowStatusBadge status={workflow.status} />
                </td>
                <td className="rounded-r-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <WorkflowAuditDialog events={workflow.events} />
                    <Button variant="secondary" size="sm">
                      Retry
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
