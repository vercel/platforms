import { Download, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  status: 'info' | 'warning' | 'critical';
  timestamp: string;
  metadata?: string;
};

type AuditTableProps = {
  events: AuditEvent[];
};

const badgeClasses: Record<AuditEvent['status'], string> = {
  info: 'bg-primary/15 text-primary',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  critical: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
};

export function AuditTable({ events }: AuditTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle>Audit logs</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-2 font-medium">Timestamp</th>
              <th className="px-4 py-2 font-medium">Actor</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="rounded-xl bg-card">
                <td className="rounded-l-xl px-4 py-3 text-muted-foreground">
                  {event.timestamp}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {event.actor}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{event.action}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                      badgeClasses[event.status]
                    )}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="rounded-r-xl px-4 py-3 text-muted-foreground">
                  {event.metadata || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export type { AuditEvent };
