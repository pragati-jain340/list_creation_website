"use client";

import { useSuggestionStore } from "@/src/store/useSuggestionStore";
import { getIcon } from "@/src/lib/iconMap";
import { Button } from "@/components/ui/button";
import { X, Plus, Pencil, Save, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSuggestion } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  notes: string | null;
  order: number;
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
  items: Item[];
};

export function SuggestModeUI({ categories, listId }: { categories: Category[], listId: string }) {
  const { pendingChanges, addAddition, addRemoval, addEdit, removeChange, clearAll } = useSuggestionStore();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (pendingChanges.length === 0) {
      toast.error("No changes to suggest");
      return;
    }

    startTransition(async () => {
      const result = await createSuggestion({
        listId,
        message,
        changes: pendingChanges.map(c => ({
          itemId: c.itemId,
          action: c.action,
          categoryId: c.categoryId,
          newValue: c.newValue,
        })),
      });

      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success("Suggestion submitted!");
        clearAll();
        router.push("/");
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left side: The List in Suggest Mode */}
      <div className="flex-1 space-y-6">
        {categories.map(cat => (
          <SuggestCategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      {/* Right side: Pending Changes Panel */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-24 bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col h-[calc(100vh-8rem)]">
          <h3 className="text-title-md font-bold mb-4">Pending Changes ({pendingChanges.length})</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {pendingChanges.length === 0 ? (
              <p className="text-muted-foreground text-body-sm text-center py-8 italic">
                No changes suggested yet.
              </p>
            ) : (
              pendingChanges.map((change, idx) => (
                <div key={idx} className="p-3 rounded border border-border/50 bg-background flex items-start justify-between gap-2 text-body-sm">
                  <div>
                    <span className={cn(
                      "inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold mb-1",
                      change.action === "add" ? "bg-green-100 text-green-700" :
                      change.action === "remove" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    )}>
                      {change.action}
                    </span>
                    <p className="font-medium line-clamp-2 text-foreground">
                      {change.action === "add" && change.newValue ? JSON.parse(change.newValue).title :
                       change.action === "edit" && change.newValue ? JSON.parse(change.newValue).title :
                       "Item"}
                    </p>
                  </div>
                  <button onClick={() => removeChange(idx)} className="text-muted-foreground hover:text-destructive">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 block">
              Message
            </label>
            <Textarea
              placeholder="Add a note for the list owner..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mb-4 h-20 resize-none border-blue-200 dark:border-blue-800/50 focus-visible:ring-blue-500/30"
              disabled={isPending}
            />
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={pendingChanges.length === 0 || isPending}
            >
              {isPending ? "Submitting..." : "Submit Suggestion"}
            </Button>
            {pendingChanges.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-muted-foreground" 
                onClick={clearAll}
                disabled={isPending}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestCategoryCard({ category }: { category: Category }) {
  const Icon = getIcon(category.icon);
  const { pendingChanges, addAddition } = useSuggestionStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (newTitle.trim()) {
      addAddition(category.id, newTitle, 1);
      setNewTitle("");
      setIsAdding(false);
    }
  };

  // Compute items to display: original items + pending additions
  const pendingAdditions = pendingChanges.filter(c => c.action === "add" && c.categoryId === category.id);

  return (
    <div className="bg-card border border-border rounded shadow-sm">
      <div className="p-4 border-b border-border/50 flex items-center space-x-3">
        <div className="p-2 bg-muted rounded-md text-primary">
          <Icon size={20} />
        </div>
        <h2 className="text-title-lg font-bold text-foreground">
          {category.name}
        </h2>
      </div>
      
      <div className="p-4 flex flex-col gap-1">
        {category.items.map(item => (
          <SuggestItemRow key={item.id} item={item} categoryId={category.id} />
        ))}
        
        {pendingAdditions.map((addition, idx) => {
          const data = JSON.parse(addition.newValue!);
          return (
            <div key={idx} className="flex items-center justify-between py-2 px-2 bg-green-50/50 rounded-md border border-green-100 mt-1">
              <span className="text-green-700 text-body-base line-clamp-1">{data.title}</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">Added</span>
            </div>
          );
        })}

        {isAdding ? (
          <div className="flex items-center gap-2 mt-2">
            <Input 
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)} 
              placeholder="New item..."
              autoFocus
              className="h-8 text-body-base"
              onKeyDown={e => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <Button size="icon" variant="ghost" onClick={handleAdd} className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
              <Save size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setIsAdding(false)} className="h-8 w-8 text-muted-foreground">
              <X size={16} />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full justify-start text-muted-foreground border border-dashed border-border"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={14} className="mr-2" /> Add Item
          </Button>
        )}
      </div>
    </div>
  );
}

function SuggestItemRow({ item, categoryId }: { item: Item, categoryId: string }) {
  const { pendingChanges, addRemoval, addEdit } = useSuggestionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);

  // Check if this item has pending changes
  const removal = pendingChanges.find(c => c.action === "remove" && c.itemId === item.id);
  const edit = pendingChanges.find(c => c.action === "edit" && c.itemId === item.id);

  const isRemoved = !!removal;
  const displayTitle = edit && edit.newValue ? JSON.parse(edit.newValue).title : item.title;

  const handleEditSave = () => {
    if (editTitle.trim() && editTitle !== item.title) {
      addEdit(item.id, categoryId, { title: editTitle });
    }
    setIsEditing(false);
  };

  if (isRemoved) {
    return (
      <div className="flex items-center justify-between py-2 px-2 bg-red-50/50 rounded-md border border-red-100 opacity-70">
        <span className="text-red-700 text-body-base line-through line-clamp-1">{item.title}</span>
        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">Removed</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center justify-between py-2 px-2 group rounded-md border border-transparent transition-colors",
      edit ? "bg-yellow-50/30 border-yellow-100" : "hover:bg-muted/50"
    )}>
      <div className="flex-1 flex items-center min-w-0 mr-4">
        {isEditing ? (
          <Input 
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="h-7 py-1 px-2 text-body-base w-full max-w-[200px]"
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            onBlur={handleEditSave}
          />
        ) : (
          <span className="text-body-base truncate" onDoubleClick={() => setIsEditing(true)}>
            {item.quantity > 1 ? `${item.quantity}x ` : ""}{displayTitle}
          </span>
        )}
        {edit && !isEditing && (
          <span className="ml-2 text-[10px] font-medium text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded flex-shrink-0">Edited</span>
        )}
      </div>

      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setIsEditing(true);
            setEditTitle(displayTitle);
          }}
        >
          <Pencil size={14} />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7 text-muted-foreground hover:text-red-600"
          onClick={() => addRemoval(item.id, categoryId)}
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
