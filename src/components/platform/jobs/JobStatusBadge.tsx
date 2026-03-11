import { cn } from "@/lib/utils";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS, type JobStatus } from "@/lib/types/platform";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        JOB_STATUS_COLORS[status],
      )}
    >
      {JOB_STATUS_LABELS[status]}
    </span>
  );
}
