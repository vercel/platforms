import { cn } from '@/lib/utils';

type WorkflowStatus = 'success' | 'running' | 'failed' | 'queued';

type WorkflowStatusBadgeProps = {
  status: WorkflowStatus;
};

const styles: Record<WorkflowStatus, string> = {
  success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  running: 'bg-primary/15 text-primary',
  failed: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  queued: 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
};

const labels: Record<WorkflowStatus, string> = {
  success: 'Success',
  running: 'Running',
  failed: 'Failed',
  queued: 'Queued'
};

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
