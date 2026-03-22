"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "text/plain": [".txt"],
  "text/markdown": [".md"],
};

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setStatus("idle");
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection?.errors[0]?.code === "file-too-large") {
        setError("File terlalu besar. Maksimal 10MB.");
      } else if (rejection?.errors[0]?.code === "file-invalid-type") {
        setError("Tipe file tidak didukung. Gunakan PDF, DOCX, TXT, atau MD.");
      } else {
        setError("File tidak valid.");
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setStatus("uploading");
      setError(null);
      await onUpload(selectedFile);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Gagal mengupload file.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
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
          Upload Berhasil!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          File sedang diproses oleh AI. Ringkasan akan segera tersedia.
        </p>
        <Button variant="outline" className="mt-6" onClick={handleReset}>
          Upload File Lain
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
          Upload Gagal
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || "Terjadi kesalahan saat mengupload file."}
        </p>
        <Button variant="outline" className="mt-6" onClick={handleReset}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
          selectedFile && "bg-accent/30"
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 font-medium">{selectedFile.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
            >
              <X className="mr-1 h-3 w-3" />
              Ganti file
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Upload className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium">
              {isDragActive
                ? "Drop file di sini..."
                : "Drag & drop file, atau klik untuk pilih"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              PDF, DOCX, TXT, Markdown (maks. 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && status === "idle" && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload button */}
      {selectedFile && status === "idle" && (
        <Button className="w-full" size="lg" onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload & Proses dengan AI
        </Button>
      )}

      {/* Loading state */}
      {(status === "uploading" || status === "processing") && (
        <div className="flex items-center justify-center gap-3 rounded-lg border p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm">
            {status === "uploading"
              ? "Mengupload file..."
              : "Memproses dengan AI..."}
          </span>
        </div>
      )}
    </div>
  );
}
