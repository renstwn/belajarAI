"use client";

import { useState, useMemo, useEffect } from "react";
import { MaterialCard } from "@/components/materials/material-card";
import {
  SearchFilterBar,
  type FilterType,
  type ViewMode,
} from "@/components/materials/search-filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMaterials } from "@/lib/services/materials";
import type { MaterialWithDetails } from "@/types";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    getMaterials()
      .then((data) => {
        setMaterials(data);
      })
      .catch((err) => {
        console.error("Failed to load materials:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredMaterials = useMemo(() => {
    let result = [...materials];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary?.short_summary?.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (activeFilter) {
      case "document":
        result = result.filter((m) => m.source_type === "document");
        break;
      case "youtube":
        result = result.filter((m) => m.source_type === "youtube");
        break;
      case "favorite":
        result = result.filter((m) => m.bookmark !== null);
        break;
      case "recent":
        result = result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
    }

    return result;
  }, [searchQuery, activeFilter, materials]);

  if (loading) {
    return <LoadingState message="Memuat materi..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Semua Materi</h2>
        <p className="text-muted-foreground">
          {filteredMaterials.length} materi ditemukan
        </p>
      </div>

      {/* Search & Filter */}
      <SearchFilterBar
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
        onViewChange={setViewMode}
        activeFilter={activeFilter}
        activeView={viewMode}
      />

      {/* Materials Grid/List */}
      {filteredMaterials.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Tidak ada materi"
          description={
            searchQuery
              ? `Tidak ada materi yang cocok dengan "${searchQuery}". Coba kata kunci lain.`
              : "Belum ada materi. Mulai dengan mengupload dokumen atau menambahkan link YouTube."
          }
          action={
            !searchQuery ? (
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/upload">Upload Dokumen</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/youtube">Tambah YouTube</Link>
                </Button>
              </div>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
