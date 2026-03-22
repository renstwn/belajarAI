import Link from "next/link";
import { StatsCard } from "@/components/dashboard/stats-card";
import { MaterialCard } from "@/components/materials/material-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Bookmark,
  Upload,
  Youtube,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getMaterials, getDashboardStats } from "@/lib/services/materials";

export default async function DashboardPage() {
  const [materials, stats] = await Promise.all([
    getMaterials(),
    getDashboardStats(),
  ]);

  const recentMaterials = materials.slice(0, 3);
  const inProgressMaterials = materials.filter(
    (m) => m.progress?.status === "in_progress"
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Selamat datang kembali! 👋
          </h2>
          <p className="text-muted-foreground">
            Lanjutkan belajar dan capai target pemahaman kamu hari ini.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Dokumen
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/youtube">
              <Youtube className="mr-2 h-4 w-4" />
              YouTube
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Materi"
          value={stats.totalMaterials}
          description="Materi yang telah ditambahkan"
          icon={BookOpen}
        />
        <StatsCard
          title="Ringkasan AI"
          value={stats.totalSummaries}
          description="Ringkasan yang dihasilkan AI"
          icon={FileText}
        />
        <StatsCard
          title="Materi Selesai"
          value={stats.completedMaterials}
          description={`${stats.progressPercentage}% dari total materi`}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Bookmark"
          value={stats.totalBookmarks}
          description="Materi yang ditandai"
          icon={Bookmark}
        />
      </div>

      {/* Progress Overview */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Progress Belajar</h3>
          </div>
          <span className="text-2xl font-bold text-primary">
            {stats.progressPercentage}%
          </span>
        </div>
        <Progress value={stats.progressPercentage} className="h-3" />
        <div className="mt-3 flex justify-between text-sm text-muted-foreground">
          <span>
            {stats.completedMaterials} dari {stats.totalMaterials}{" "}
            materi selesai
          </span>
          <span>Target: 100%</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 font-semibold">Aksi Cepat</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/upload"
            className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">
                Upload Dokumen
              </p>
              <p className="text-sm text-muted-foreground">PDF, DOCX, TXT, MD</p>
            </div>
          </Link>
          <Link
            href="/youtube"
            className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30">
              <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">
                Link YouTube
              </p>
              <p className="text-sm text-muted-foreground">
                Paste URL video
              </p>
            </div>
          </Link>
          <Link
            href="/bookmarks"
            className="group flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/30">
              <Bookmark className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">
                Bookmark
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.totalBookmarks} materi ditandai
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Continue Learning */}
      {inProgressMaterials.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Lanjutkan Belajar</h3>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/materials">
                Lihat semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgressMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Materials */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Materi Terbaru</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/materials">
              Lihat semua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      </div>
    </div>
  );
}
