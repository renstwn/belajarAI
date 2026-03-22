import { Badge } from "@/components/ui/badge";
import { FileText, Youtube } from "lucide-react";
import type { SourceType } from "@/types";

interface SourceBadgeProps {
  sourceType: SourceType;
}

export function SourceBadge({ sourceType }: SourceBadgeProps) {
  if (sourceType === "youtube") {
    return (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
      >
        <Youtube className="mr-1 h-3 w-3" />
        YouTube
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
    >
      <FileText className="mr-1 h-3 w-3" />
      Document
    </Badge>
  );
}
