"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SummaryTabs } from "@/components/materials/summary-tabs";
import { SourceBadge } from "@/components/shared/source-badge";
import { ProgressBadge } from "@/components/shared/progress-badge";
import { NoteEditor } from "@/components/shared/note-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getMaterialById, toggleBookmark, updateProgress, saveNote } from "@/lib/services/materials";
import type { MaterialWithDetails, ProgressStatus } from "@/types";

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [material, setMaterial] = useState<MaterialWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("unread");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getMaterialById(id)
      .then((data) => {
        setMaterial(data);
        if (data) {
          setIsBookmarked(!!data.bookmark);
          setProgressStatus(data.progress?.status || "unread");
        }
      })
      .catch((err) => {
        console.error("Failed to load material:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleToggleChecklist = (index: number) => {
    setChecklist((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleProgressChange = (status: ProgressStatus) => {
    setProgressStatus(status);
    if (material) updateProgress(material.id, status);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!material) {
    notFound();
  }

  if (!material.summary) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/materials">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Materi
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
          <div>
            <h2 className="text-xl font-semibold">Ringkasan Belum Tersedia</h2>
            <p className="text-muted-foreground mt-1">
              Materi &quot;{material.title}&quot; belum memiliki ringkasan AI. Coba hapus dan upload ulang materi ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summary = material.summary;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/materials">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Materi
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge sourceType={material.source_type} />
          <ProgressBadge status={progressStatus} />
          {material.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{material.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {summary.estimated_read_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {summary.estimated_read_time} menit baca
            </span>
          )}
          <span>Ditambahkan {formatDate(material.created_at)}</span>
          {material.source_url && (
            <a
              href={material.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lihat sumber asli
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={async () => {
              const bookmarked = await toggleBookmark(material.id);
              setIsBookmarked(bookmarked);
            }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="mr-2 h-4 w-4" />
            ) : (
              <Bookmark className="mr-2 h-4 w-4" />
            )}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          {progressStatus !== "completed" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressChange("completed")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Tandai Selesai
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleProgressChange("unread")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              Sudah Selesai
            </Button>
          )}
          {progressStatus === "unread" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressChange("in_progress")}
            >
              Mulai Belajar
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Short Summary */}
      <div className="rounded-xl border bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Ringkasan Singkat</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {summary.short_summary}
        </p>
      </div>

      {/* Learning Mode Tabs */}
      <div>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Mode Belajar
        </h2>
        <SummaryTabs
          oneMinute={summary.one_minute_summary}
          fiveMinute={summary.five_minute_summary}
          full={summary.full_summary}
        />
      </div>

      {/* Key Points */}
      {summary.key_points.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Poin Penting
          </h2>
          <div className="grid gap-2">
            {summary.key_points.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Terms */}
      {summary.important_terms.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Istilah Penting</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.important_terms.map((term, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h4 className="font-semibold text-primary">{term.term}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      {summary.key_points.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Checklist Pemahaman
          </h2>
          <div className="rounded-lg border p-4 space-y-3">
            {summary.key_points.map((point, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`check-${index}`}
                  checked={checklist[index] || false}
                  onCheckedChange={() => handleToggleChecklist(index)}
                />
                <label
                  htmlFor={`check-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Memahami: {point}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {summary.faq.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            FAQ
          </h2>
          <div className="space-y-3">
            {summary.faq.map((item, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h4 className="font-medium">{item.question}</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conclusion */}
      {summary.conclusion && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-3 text-lg font-semibold">Kesimpulan</h2>
          <p className="text-muted-foreground leading-relaxed">
            {summary.conclusion}
          </p>
        </div>
      )}

      {/* Next Steps */}
      {summary.next_steps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Langkah Selanjutnya
          </h2>
          <div className="grid gap-2">
            {summary.next_steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Personal Notes */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Catatan Pribadi</h2>
        <NoteEditor
          initialContent={material.note?.content || ""}
          onSave={(content) => {
            saveNote(material.id, content);
          }}
        />
      </div>
    </div>
  );
}
