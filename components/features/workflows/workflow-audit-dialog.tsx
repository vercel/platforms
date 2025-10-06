import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type WorkflowAuditEvent = {
  id: string;
  step: string;
  status: string;
  timestamp: string;
  notes?: string;
};

type WorkflowAuditDialogProps = {
  events: WorkflowAuditEvent[];
};

export function WorkflowAuditDialog({ events }: WorkflowAuditDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View audit trail
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workflow audit trail</DialogTitle>
          <DialogDescription>
            Detailed execution history for the selected workflow run.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border px-3 py-2">
              <p className="font-medium text-foreground">{event.step}</p>
              <p className="text-xs text-muted-foreground">{event.timestamp}</p>
              <p className="mt-1 text-muted-foreground">Status: {event.status}</p>
              {event.notes ? (
                <p className="mt-2 text-muted-foreground">Notes: {event.notes}</p>
              ) : null}
            </div>
          ))}
          {!events.length ? (
            <p className="text-muted-foreground">
              No audit events recorded for this workflow run.
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
