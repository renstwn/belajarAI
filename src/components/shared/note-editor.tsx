"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, PenLine } from "lucide-react";

interface NoteEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  saving?: boolean;
}

export function NoteEditor({
  initialContent = "",
  onSave,
  saving = false,
}: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  if (!isEditing && !content) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsEditing(true)}
      >
        <PenLine className="mr-2 h-4 w-4" />
        Tambahkan catatan pribadi...
      </Button>
    );
  }

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer rounded-lg border p-4 text-sm hover:bg-accent/50 transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Catatan Pribadi
          </span>
          <PenLine className="h-3 w-3 text-muted-foreground" />
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis catatan pribadi untuk materi ini..."
        className="min-h-[120px] resize-none"
        autoFocus
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setContent(initialContent);
            setIsEditing(false);
          }}
        >
          Batal
        </Button>
      </div>
    </div>
  );
}
