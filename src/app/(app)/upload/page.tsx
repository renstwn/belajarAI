"use client";

import { useRouter } from "next/navigation";
import { DocumentUpload } from "@/components/upload/document-upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Shield, Sparkles, Clock } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload gagal");
    }

    router.push("/materials");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upload Dokumen</h2>
        <p className="text-muted-foreground">
          Upload file pembelajaran dan AI akan merangkum isinya menjadi materi
          yang mudah dipahami.
        </p>
      </div>

      {/* Upload Area */}
      <DocumentUpload onUpload={handleUpload} />

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Format Didukung</CardTitle>
            <CardDescription className="mt-1">
              PDF, DOCX, TXT, dan Markdown. Maksimal 10MB per file.
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
            <CardTitle className="text-sm">AI Summarizer</CardTitle>
            <CardDescription className="mt-1">
              AI akan membuat ringkasan 1 menit, 5 menit, dan versi lengkap.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Proses Cepat</CardTitle>
            <CardDescription className="mt-1">
              Ringkasan tersedia dalam hitungan detik setelah upload.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Cara Kerja</h3>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Upload file materi",
              desc: "Drag & drop atau pilih file dari komputer",
            },
            {
              step: 2,
              title: "AI membaca dan menganalisis",
              desc: "Teks diekstrak dan dikirim ke AI untuk analisis mendalam",
            },
            {
              step: 3,
              title: "Ringkasan siap",
              desc: "Dapatkan ringkasan terstruktur dengan poin penting, FAQ, dan langkah selanjutnya",
            },
            {
              step: 4,
              title: "Mulai belajar",
              desc: "Pilih mode belajar: 1 menit, 5 menit, atau lengkap",
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
