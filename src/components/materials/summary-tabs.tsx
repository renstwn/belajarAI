"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Timer, FileText } from "lucide-react";

interface SummaryTabsProps {
  oneMinute: string | null;
  fiveMinute: string | null;
  full: string | null;
}

export function SummaryTabs({ oneMinute, fiveMinute, full }: SummaryTabsProps) {
  return (
    <Tabs defaultValue="1min" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="1min" className="gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">1 Menit</span>
          <span className="sm:hidden">1 Min</span>
        </TabsTrigger>
        <TabsTrigger value="5min" className="gap-2">
          <Timer className="h-4 w-4" />
          <span className="hidden sm:inline">5 Menit</span>
          <span className="sm:hidden">5 Min</span>
        </TabsTrigger>
        <TabsTrigger value="full" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Lengkap</span>
          <span className="sm:hidden">Full</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="1min" className="mt-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Belajar Cepat 1 Menit</h3>
              <p className="text-xs text-muted-foreground">
                Inti materi dalam waktu singkat
              </p>
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {oneMinute ? (
              <div className="whitespace-pre-wrap">{oneMinute}</div>
            ) : (
              <p className="text-muted-foreground italic">
                Ringkasan 1 menit belum tersedia.
              </p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="5min" className="mt-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Timer className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Belajar 5 Menit</h3>
              <p className="text-xs text-muted-foreground">
                Penjelasan lebih detail dengan contoh
              </p>
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {fiveMinute ? (
              <div className="whitespace-pre-wrap">{fiveMinute}</div>
            ) : (
              <p className="text-muted-foreground italic">
                Ringkasan 5 menit belum tersedia.
              </p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="full" className="mt-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Ringkasan Lengkap</h3>
              <p className="text-xs text-muted-foreground">
                Semua materi tercakup secara menyeluruh
              </p>
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {full ? (
              <div className="whitespace-pre-wrap">{full}</div>
            ) : (
              <p className="text-muted-foreground italic">
                Ringkasan lengkap belum tersedia.
              </p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
