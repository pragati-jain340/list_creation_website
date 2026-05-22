"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateList } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type EditableTitleProps = {
  listId: string;
  title: string;
  description?: string | null;
};

export function EditableTitle({ listId, title, description }: EditableTitleProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    if (!editValue.trim()) {
      toast.error("Title cannot be empty");
      setEditValue(title);
      setEditing(false);
      return;
    }
    if (editValue.trim() === title) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await updateList(listId, {
        title: editValue.trim(),
        description: description,
      });
      if (result && !result.success) {
        toast.error(result.error);
        setEditValue(title);
      } else {
        toast.success("Title updated");
        router.refresh();
      }
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setEditValue(title);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className={cn(
            "text-headline-xl font-heading font-bold text-foreground bg-transparent",
            "border-b-2 border-primary outline-none py-1 w-full",
            "placeholder:text-muted-foreground/50"
          )}
          placeholder="List title..."
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
          aria-label="Save title"
        >
          <Check size={18} />
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex-shrink-0"
          aria-label="Cancel editing"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="group/title flex items-center gap-2">
      <h1 className="text-headline-xl font-heading font-bold text-foreground">
        {title}
      </h1>
      <button
        onClick={() => setEditing(true)}
        className="p-1.5 rounded-md text-muted-foreground opacity-0 group-hover/title:opacity-100 hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0"
        aria-label="Edit title"
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}
