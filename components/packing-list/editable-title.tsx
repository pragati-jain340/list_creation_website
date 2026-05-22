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
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const [isPending, startTransition] = useTransition();
  const titleRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (editing && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      setEditTitle(title);
      setEditDescription(description || "");
      setEditing(false);
      return;
    }

    const titleUnchanged = editTitle.trim() === title;
    const descUnchanged = editDescription.trim() === (description || "");

    if (titleUnchanged && descUnchanged) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updateList(listId, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      if (result && !result.success) {
        toast.error(result.error);
        setEditTitle(title);
        setEditDescription(description || "");
      } else {
        toast.success("List updated");
        router.refresh();
      }
      setEditing(false);
    });
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description || "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Don't save on Enter in title — just move focus to description
    }
    handleKeyDown(e);
  };

  const handleDescKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    handleKeyDown(e);
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        {/* Title input */}
        <div className="flex items-center gap-2">
          <input
            ref={titleRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            disabled={isPending}
            className={cn(
              "text-headline-xl font-heading font-bold text-foreground bg-transparent",
              "border-b-2 border-primary outline-none py-1 w-full",
              "placeholder:text-muted-foreground/50"
            )}
            placeholder="List title..."
          />
        </div>

        {/* Description input */}
        <div className="flex items-center gap-2">
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleDescKeyDown}
            disabled={isPending}
            className={cn(
              "text-body-base text-muted-foreground bg-transparent",
              "border-b-2 border-primary/50 outline-none py-1 w-full",
              "placeholder:text-muted-foreground/40",
              "focus:border-primary transition-colors"
            )}
            placeholder="Add a description..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            aria-label="Save changes"
          >
            <Check size={15} />
            Save
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
            aria-label="Cancel editing"
          >
            <X size={15} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/title">
      <div className="flex items-center gap-2">
        <h1 className="text-headline-xl font-heading font-bold text-foreground">
          {title}
        </h1>
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-md text-muted-foreground opacity-0 group-hover/title:opacity-100 hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0"
          aria-label="Edit title and description"
        >
          <Pencil size={16} />
        </button>
      </div>
      {description && (
        <p className="text-body-base text-primary/70 mt-1 cursor-pointer hover:text-primary transition-colors"
           onClick={() => setEditing(true)}
        >
          {description}
        </p>
      )}
      {!description && (
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-muted-foreground/50 hover:text-primary/70 transition-colors mt-1 italic"
        >
          + Add a description...
        </button>
      )}
    </div>
  );
}
