"use client";

import { getIcon } from "@/src/lib/iconMap";
import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";
import { AddCategoryModal } from "./add-category-modal";
import { SettingsModal } from "./settings-modal";
import { UserSwitcher } from "./user-switcher";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  icon: string | null;
  listId: string;
};

type SidebarProps = {
  categories: Category[];
  listId: string;
  listTitle?: string;
  listDescription?: string | null;
  isOwner?: boolean;
};

export function Sidebar({ categories, listId, listTitle = "", listDescription, isOwner = false }: SidebarProps) {
  const params = useParams();
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar border-r border-sidebar-border p-4 gap-6">
      <div className="px-2 flex items-center gap-2.5">
        <div className="p-1.5 bg-primary/10 rounded-lg">
          <ListTodo className="h-4 w-4 text-primary" />
        </div>
        <h1 className="text-primary font-heading font-bold text-lg tracking-tight">
          Warm Planner
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <p className="px-2 text-label-bold text-muted-foreground uppercase mb-2">
            Categories
          </p>
          {categories.map((cat) => {
            const Icon = getIcon(cat.icon);
            return (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className={cn(
                  "flex items-center gap-3 w-full text-left px-2 py-2 rounded-md",
                  "text-body-sm font-medium text-sidebar-foreground",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                )}
              >
                <Icon size={16} className="text-muted-foreground" />
                <span>{cat.name}</span>
              </button>
            );
          })}
          {isOwner && (
            <div className="px-2 mt-2">
              <AddCategoryModal listId={listId} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-sidebar-border">
        {isOwner && (
          <SettingsModal
            listId={listId}
            listTitle={listTitle}
            listDescription={listDescription}
          />
        )}
        <UserSwitcher />
      </div>
    </div>
  );
}
