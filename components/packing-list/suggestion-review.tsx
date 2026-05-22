"use client";

import { useTransition } from "react";
import { Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/src/lib/iconMap";
import { cn } from "@/lib/utils";
import { acceptAllChanges, rejectAllChanges } from "@/app/actions";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

type Item = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  categoryId: string;
  order: number;
};

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

type Change = {
  id: string;
  suggestionId: string;
  itemId: string | null;
  categoryId: string | null;
  action: string;
  newValue: string | null;
};

type SuggestionReviewProps = {
  suggestion: { id: string, createdAt: Date, message?: string | null };
  changes: Change[];
  categories: Category[];
  originalItems: Item[];
  authorName: string;
  totalPending: number;
};

export function SuggestionReview({ suggestion, changes, categories, originalItems, authorName, totalPending }: SuggestionReviewProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const listId = params?.listId as string | undefined;

  const handleReview = (status: "accepted" | "rejected") => {
    startTransition(async () => {
      let result;
      if (status === "accepted") {
        result = await acceptAllChanges(suggestion.id);
      } else {
        result = await rejectAllChanges(suggestion.id);
      }
      
      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success(`Suggestion ${status}`);
        router.push(listId ? `/lists/${listId}/suggest` : "/");
      }
    });
  };

  // Group original items by category
  const categoriesWithOriginalItems = categories.map((cat) => ({
    ...cat,
    items: originalItems.filter((i) => i.categoryId === cat.id).sort((a, b) => a.order - b.order),
  }));

  // Build the proposed changes list
  // For simplicity, we assume action="add" or "remove" or "edit".
  // newValue holds JSON string of the item if added/edited.
  const getProposedCategoryItems = (categoryId: string) => {
    let items = originalItems.filter((i) => i.categoryId === categoryId).sort((a, b) => a.order - b.order);
    
    const categoryChanges = changes.filter(c => c.categoryId === categoryId || items.some(i => i.id === c.itemId));

    let proposedItems = items.map(item => {
      const change = categoryChanges.find(c => c.itemId === item.id);
      if (change && change.action === "remove") {
        return { ...item, status: "removed" };
      }
      if (change && change.action === "edit" && change.newValue) {
        const parsed = JSON.parse(change.newValue);
        return { ...item, title: parsed.title || item.title, status: "edited" };
      }
      return { ...item, status: "unchanged" };
    });

    categoryChanges.filter(c => c.action === "add").forEach(change => {
      if (change.newValue && change.categoryId === categoryId) {
        const parsed = JSON.parse(change.newValue);
        proposedItems.push({
          id: `new-${change.id}`,
          title: parsed.title,
          quantity: parsed.quantity || 1,
          completed: false,
          categoryId: change.categoryId,
          order: 999, // push to end
          status: "added"
        });
      }
    });

    return proposedItems;
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-primary text-label-bold uppercase tracking-wider mb-2">
        <Check size={16} />
        <span>Review Suggestions</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-headline-xl font-heading font-bold text-foreground">
            List Updates
          </h1>
          <p className="text-body-base text-muted-foreground flex items-center gap-2">
            <span className="font-medium text-foreground">{authorName}</span> has suggested some modifications to your packing list.
          </p>
          {suggestion.message && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
              <p className="text-body-sm text-blue-700 dark:text-blue-300 italic">&quot;{suggestion.message}&quot;</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleReview("rejected")}
            disabled={isPending}
          >
            Reject All
          </Button>
          <Button 
            onClick={() => handleReview("accepted")}
            disabled={isPending}
          >
            Accept All Changes
          </Button>
        </div>
      </div>

      <div className="bg-secondary/50 p-4 rounded-lg flex items-start gap-3 mb-8 border border-border">
        <Info className="text-muted-foreground mt-0.5" size={20} />
        <p className="text-body-sm text-foreground">
          <strong>Legend:</strong> Items highlighted in <span className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1 rounded">green</span> are suggested additions. Items highlighted in <span className="text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-1 rounded">red</span> are suggested removals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Column */}
        <div className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="border-b border-border pb-4 mb-6">
            <p className="text-label-bold text-muted-foreground uppercase tracking-wider">Current Version</p>
            <h3 className="text-headline-lg-mobile font-bold mt-1">Original List</h3>
          </div>
          
          {categoriesWithOriginalItems.map(cat => {
            const Icon = getIcon(cat.icon);
            return (
              <div key={`orig-${cat.id}`} className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Icon size={18} className="text-primary" />
                  <h4>{cat.name}</h4>
                </div>
                <div className="space-y-1 pl-6 relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border/50" />
                  {cat.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2">
                      <div className="w-4 h-4 rounded border border-muted-foreground/50 flex-shrink-0" />
                      <span className="text-body-base text-foreground">
                        {item.title}
                      </span>
                    </div>
                  ))}
                  {cat.items.length === 0 && (
                    <p className="text-body-sm text-muted-foreground italic py-2">No items</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Proposed Column */}
        <div className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="border-b border-border pb-4 mb-6">
            <p className="text-label-bold text-primary uppercase tracking-wider">Proposed Changes</p>
            <h3 className="text-headline-lg-mobile font-bold mt-1">Suggested by {authorName}</h3>
          </div>
          
          {categories.map(cat => {
            const Icon = getIcon(cat.icon);
            const proposedItems = getProposedCategoryItems(cat.id);
            return (
              <div key={`prop-${cat.id}`} className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <Icon size={18} className="text-primary" />
                  <h4>{cat.name}</h4>
                </div>
                <div className="space-y-2 pl-6 relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border/50" />
                  
                  {proposedItems.map(item => (
                    <div 
                      key={item.id} 
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-colors",
                        item.status === "added" && "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/50",
                        item.status === "removed" && "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
                        item.status === "edited" && "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50",
                        item.status === "unchanged" && "opacity-60"
                      )}
                    >
                      {item.status === "added" ? (
                        <div className="w-4 h-4 rounded bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">+</div>
                      ) : item.status === "removed" ? (
                        <div className="w-4 h-4 rounded bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">×</div>
                      ) : item.status === "edited" ? (
                        <div className="w-4 h-4 rounded bg-yellow-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">~</div>
                      ) : (
                        <div className="w-4 h-4 rounded border border-muted-foreground/50 flex-shrink-0" />
                      )}
                      
                      <span className={cn(
                        "text-body-base",
                        item.status === "removed" && "line-through"
                      )}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                  {proposedItems.length === 0 && (
                    <p className="text-body-sm text-muted-foreground italic py-2">No items</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
