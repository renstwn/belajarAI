"use client";

import { useRouter } from "next/navigation";
import { YouTubeInput } from "@/components/upload/youtube-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Subtitles, Sparkles, Globe } from "lucide-react";

export default function YouTubePage() {
  const router = useRouter();

  const handleSubmit = async (url: string) => {
    const res = await fetch("/api/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Gagal memproses video");
    }

    router.push("/materials");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tambah Video YouTube</h2>
        <p className="text-muted-foreground">
          Paste link YouTube dan AI akan merangkum konten video menjadi materi
          belajar yang terstruktur.
        </p>
      </div>

      {/* YouTube Input */}
      <YouTubeInput onSubmit={handleSubmit} />

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30">
              <Subtitles className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Auto-Transcript</CardTitle>
            <CardDescription className="mt-1">
              Sistem mengambil subtitle/transcript video secara otomatis.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">AI Summary</CardTitle>
            <CardDescription className="mt-1">
              Transcript dianalisis AI menjadi ringkasan belajar yang efektif.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Multi-Language</CardTitle>
            <CardDescription className="mt-1">
              Mendukung video dalam berbagai bahasa yang memiliki subtitle.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Tips</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Pastikan video memiliki subtitle/closed captions untuk hasil terbaik
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Video tutorial dan edukatif biasanya menghasilkan ringkasan yang lebih baik
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Link video bisa berupa format youtube.com/watch?v=... atau youtu.be/...
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Jika transcript tidak tersedia, coba video lain yang memiliki subtitle aktif
          </li>
        </ul>
      </div>
    </div>
  );
}
