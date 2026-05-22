"use client";

import { getIcon, iconMap } from "@/src/lib/iconMap";
import { SortableChecklist } from "./sortable-checklist";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory, updateCategoryIcon } from "@/app/actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  notes: string | null;
  order: number;
};

type CategoryCardProps = {
  id: string;
  name: string;
  iconName: string | null;
  items: Item[];
};

export function CategoryCard({ id, name, iconName, items }: CategoryCardProps) {
  const Icon = getIcon(iconName);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this category and all its items?")) {
      startTransition(async () => {
        const result = await deleteCategory(id);
        if (result && !result.success) {
          toast.error(result.error);
        } else {
          toast.success("Category deleted");
        }
      });
    }
  };

  const handleIconChange = (newIcon: string) => {
    startTransition(async () => {
      const result = await updateCategoryIcon(id, newIcon);
      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success("Icon updated");
      }
    });
  };

  return (
    <div
      id={id}
      className="bg-card border border-border/60 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-2 bg-muted rounded-md text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                aria-label="Change category icon"
                disabled={isPending}
              >
                <Icon size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2">
              <div className="flex flex-wrap gap-2">
                {Object.keys(iconMap).map((key) => {
                  const MappedIcon = iconMap[key as keyof typeof iconMap];
                  return (
                    <button
                      key={key}
                      onClick={() => handleIconChange(key)}
                      className={cn(
                        "p-2 rounded-md hover:bg-accent transition-colors",
                        iconName === key && "bg-primary/20 text-primary"
                      )}
                    >
                      <MappedIcon size={20} />
                    </button>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <h2 className="text-headline-lg-mobile font-bold text-foreground">
            {name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete category"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-6 flex flex-col gap-1">
        <SortableChecklist initialItems={items} />
      </div>
    </div>
  );
}
