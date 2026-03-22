import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Materi yang kamu cari tidak ditemukan atau telah dihapus.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard">Ke Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/materials">Lihat Materi</Link>
        </Button>
      </div>
    </div>
  );
}
