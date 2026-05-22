"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useTransition, useEffect, useId } from "react";
import { ChecklistItem } from "./checklist-item";
import { reorderItems } from "@/app/actions";

type Item = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  notes: string | null;
  order: number;
};

export function SortableChecklist({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  // Sync state if initialItems change (e.g. from server actions)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      startTransition(async () => {
        const result = await reorderItems(
          newItems.map((item, index) => ({ id: item.id, order: index }))
        );
        if (result && !result.success) {
          import("sonner").then((mod) => mod.toast.error(result.error));
          setItems(items); // revert
        }
      });
    }
  };

  const dndId = useId();

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-body-sm italic">
        No items yet.
      </p>
    );
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            title={item.title}
            completed={item.completed}
            quantity={item.quantity}
            notes={item.notes}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
