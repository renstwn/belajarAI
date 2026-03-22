"use client";

import { useState, useEffect } from "react";
import { MaterialCard } from "@/components/materials/material-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMaterials } from "@/lib/services/materials";
import type { MaterialWithDetails } from "@/types";

export default function BookmarksPage() {
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState<MaterialWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaterials()
      .then((data) => {
        setBookmarkedMaterials(data.filter((m) => m.bookmark !== null));
      })
      .catch((err) => {
        console.error("Failed to load bookmarks:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingState message="Memuat bookmark..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bookmark</h2>
        <p className="text-muted-foreground">
          {bookmarkedMaterials.length} materi yang kamu tandai
        </p>
      </div>

      {/* Bookmarked Materials */}
      {bookmarkedMaterials.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarkedMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="Belum ada bookmark"
          description="Tandai materi favorit dengan bookmark agar mudah ditemukan kembali."
          action={
            <Button asChild>
              <Link href="/materials">Jelajahi Materi</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
