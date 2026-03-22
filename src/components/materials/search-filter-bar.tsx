"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceType } from "@/types";

export type FilterType = "all" | SourceType | "favorite" | "recent";
export type ViewMode = "grid" | "list";

interface SearchFilterBarProps {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onViewChange: (view: ViewMode) => void;
  activeFilter: FilterType;
  activeView: ViewMode;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "document", label: "Dokumen" },
  { value: "youtube", label: "YouTube" },
  { value: "recent", label: "Terbaru" },
  { value: "favorite", label: "Favorit" },
];

export function SearchFilterBar({
  onSearchChange,
  onFilterChange,
  onViewChange,
  activeFilter,
  activeView,
}: SearchFilterBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari materi..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View toggle */}
        <div className="hidden sm:flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-r-none",
              activeView === "grid" && "bg-accent"
            )}
            onClick={() => onViewChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-l-none",
              activeView === "list" && "bg-accent"
            )}
            onClick={() => onViewChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="icon" className="sm:hidden">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
