"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getYouTubeVideoId } from "@/lib/utils";

type YouTubeStatus =
  | "idle"
  | "validating"
  | "processing"
  | "success"
  | "error"
  | "no_transcript";

interface YouTubeInputProps {
  onSubmit: (url: string) => Promise<void>;
}

export function YouTubeInput({ onSubmit }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<YouTubeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = url ? !!getYouTubeVideoId(url) : false;

  const handleSubmit = async () => {
    if (!isValidUrl) {
      setError("URL YouTube tidak valid.");
      return;
    }

    try {
      setStatus("processing");
      setError(null);
      await onSubmit(url);
      setStatus("success");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("transcript")
      ) {
        setStatus("no_transcript");
      } else {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Gagal memproses video."
        );
      }
    }
  };

  const handleReset = () => {
    setUrl("");
    setStatus("idle");
    setError(null);
  };

  // Success state
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-300 bg-green-50/50 p-12 text-center dark:border-green-800 dark:bg-green-950/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-green-700 dark:text-green-400">
          Video Berhasil Diproses!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Ringkasan video telah dibuat. Lihat di halaman materi.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleReset}>
          Tambah Video Lain
        </Button>
      </div>
    );
  }

  // No transcript state
  if (status === "no_transcript") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/50 p-12 text-center dark:border-amber-800 dark:bg-amber-950/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
          <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-amber-700 dark:text-amber-400">
          Transcript Tidak Tersedia
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Video ini tidak memiliki subtitle/transcript yang bisa diambil. Coba
          video lain yang memiliki subtitle.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleReset}>
          Coba Video Lain
        </Button>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50/50 p-12 text-center dark:border-red-800 dark:bg-red-950/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">
          Gagal Memproses Video
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || "Terjadi kesalahan saat memproses video."}
        </p>
        <Button variant="outline" className="mt-6" onClick={handleReset}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* YouTube Preview area */}
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <Youtube className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Tambah Video YouTube</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Paste link YouTube dan AI akan merangkum konten video menjadi materi
          belajar yang mudah dipahami.
        </p>
      </div>

      {/* URL Input */}
      <div className="space-y-3">
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Preview */}
        {isValidUrl && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            URL YouTube valid dan siap diproses
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValidUrl || status === "processing"}
        >
          {status === "processing" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses video...
            </>
          ) : (
            <>
              <Youtube className="mr-2 h-4 w-4" />
              Proses Video dengan AI
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
