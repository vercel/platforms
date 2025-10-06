import { AuditTable, type AuditEvent } from '@/components/features/audit/audit-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function AuditPage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const events: AuditEvent[] = [
    {
      id: 'audit-1',
      actor: 'System',
      action: 'Workflow "Lead enrichment" retried',
      status: 'info',
      timestamp: 'Mar 18, 2025 09:20 UTC',
      metadata: 'Triggered by policy rule'
    },
    {
      id: 'audit-2',
      actor: 'Sara Collins',
      action: 'Updated Slack integration credentials',
      status: 'warning',
      timestamp: 'Mar 17, 2025 21:04 UTC',
      metadata: 'Requires secondary approval'
    },
    {
      id: 'audit-3',
      actor: 'System',
      action: 'Blocked login attempt for Liam Patel',
      status: 'critical',
      timestamp: 'Mar 17, 2025 05:12 UTC',
      metadata: 'IP outside allow list'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit logging</CardTitle>
          <CardDescription>
            Review sensitive events captured across the {subdomain} workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Use filters, exports, and drill-down dialogs to satisfy compliance,
            governance, and incident response workflows.
          </p>
          <p>
            Critical events are highlighted to help your team prioritize urgent
            follow-up.
          </p>
        </CardContent>
      </Card>

      <AuditTable events={events} />
    </div>
  );
}
