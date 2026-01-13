import { Badge } from "@/components/ui/badge";
import { type GoalStatus, statusLabels } from "@/types/goal";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: GoalStatus;
  className?: string;
}

const statusStyles: Record<GoalStatus, string> = {
  "not-started": "bg-muted text-muted-foreground border-muted",
  "in-progress": "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/30",
  "complete": "bg-status-complete/10 text-status-complete border-status-complete/30",
  "cancelled": "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/30",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-xs px-2 py-0.5",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
