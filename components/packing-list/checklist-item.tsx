"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { toggleItem, deleteItem, updateItem } from "@/app/actions";
import { useTransition, useOptimistic, useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type ChecklistItemProps = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  notes?: string | null;
};

export function ChecklistItem({ id, title, completed, quantity, notes }: ChecklistItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(completed);
  
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      setOptimisticCompleted(checked);
      const result = await toggleItem(id, checked);
      if (result && !result.success) {
        toast.error(result.error);
        setOptimisticCompleted(!checked); // revert optimistic update
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteItem(id);
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  };

  const handleEditBlur = async () => {
    setEditing(false);
    if (editValue.trim() !== "" && editValue !== title) {
      startTransition(async () => {
        const result = await updateItem(id, { title: editValue });
        if (result && !result.success) {
          toast.error(result.error);
          setEditValue(title); // revert local state on error
        }
      });
    } else {
      setEditValue(title); // revert to original if empty
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start justify-between py-2 group transition-opacity duration-200 bg-card z-10",
        optimisticCompleted && "opacity-50",
        isDragging && "opacity-50 z-50 ring-2 ring-primary rounded-md shadow-lg"
      )}
    >
      <div className="flex items-start space-x-2 flex-1">
        <button
          className="mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing focus:outline-none flex-shrink-0"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <Checkbox
          id={`item-${id}`}
          checked={optimisticCompleted}
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="mt-1 border-[1.5px] rounded border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
        />
        <div className="flex flex-col gap-0.5 ml-1 flex-1">
          {editing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditBlur}
              onKeyDown={(e) => e.key === "Enter" && handleEditBlur()}
              autoFocus
              className="h-7 py-1 px-2 text-body-base"
              disabled={isPending}
            />
          ) : (
            <label
              htmlFor={`item-${id}`}
              onDoubleClick={() => setEditing(true)}
              className={cn(
                "text-body-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none",
                optimisticCompleted && "line-through"
              )}
            >
              {quantity > 1 ? `${quantity}x ` : ""}{title}
            </label>
          )}
          {notes && !editing && (
            <p className="text-body-sm text-muted-foreground">
              {notes}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-primary"
          onClick={() => {
            setEditValue(title);
            setEditing(true);
          }}
          disabled={isPending || optimisticCompleted}
          aria-label="Edit item"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
