"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { ProgressBadge } from "@/components/shared/progress-badge";
import { Bookmark, BookmarkCheck, Clock, ArrowRight } from "lucide-react";
import { formatRelativeDate, truncateText } from "@/lib/utils";
import type { MaterialWithDetails } from "@/types";

interface MaterialCardProps {
  material: MaterialWithDetails;
  onToggleBookmark?: (materialId: string) => void;
}

export function MaterialCard({ material, onToggleBookmark }: MaterialCardProps) {
  const isBookmarked = !!material.bookmark;
  const progressStatus = material.progress?.status || "unread";

  return (
    <Card className="group flex flex-col transition-all hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <SourceBadge sourceType={material.source_type} />
            <ProgressBadge status={progressStatus} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark?.(material.id);
            }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        <div>
          <Link href={`/materials/${material.id}`}>
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {material.title}
            </h3>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        {material.summary?.short_summary && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncateText(material.summary.short_summary, 150)}
          </p>
        )}

        {/* Tags */}
        {material.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {material.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="text-xs"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {material.summary?.estimated_read_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {material.summary.estimated_read_time} mnt baca
            </span>
          )}
          <span>{formatRelativeDate(material.created_at)}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/materials/${material.id}`}>
            Detail
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
