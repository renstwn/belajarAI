import { Badge } from "@/components/ui/badge";
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import type { ProgressStatus } from "@/types";

interface ProgressBadgeProps {
  status: ProgressStatus;
}

const statusConfig: Record<
  ProgressStatus,
  { label: string; icon: typeof Circle; className: string }
> = {
  unread: {
    label: "Belum dibaca",
    icon: Circle,
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
  },
  in_progress: {
    label: "Sedang dipelajari",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400",
  },
};

export function ProgressBadge({ status }: ProgressBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
