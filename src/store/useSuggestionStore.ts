import { create } from "zustand";
import { PendingChange } from "@/src/lib/validations";

interface SuggestionStore {
  pendingChanges: PendingChange[];
  addAddition: (categoryId: string, title: string, quantity: number, notes?: string) => void;
  addRemoval: (itemId: string, categoryId: string) => void;
  addEdit: (itemId: string, categoryId: string, updates: { title?: string; quantity?: number; notes?: string }) => void;
  removeChange: (index: number) => void;
  clearAll: () => void;
}

export const useSuggestionStore = create<SuggestionStore>((set) => ({
  pendingChanges: [],
  
  addAddition: (categoryId, title, quantity, notes) => 
    set((state) => ({
      pendingChanges: [
        ...state.pendingChanges,
        {
          action: "add",
          categoryId,
          newValue: JSON.stringify({ title, quantity, notes }),
        }
      ]
    })),

  addRemoval: (itemId, categoryId) =>
    set((state) => ({
      // If we remove an item, we probably want to cancel out any pending edits to it
      pendingChanges: [
        ...state.pendingChanges.filter(c => c.itemId !== itemId),
        {
          action: "remove",
          itemId,
          categoryId,
        }
      ]
    })),

  addEdit: (itemId, categoryId, updates) =>
    set((state) => {
      // Find existing edit for this item and merge, or create new
      const existingIdx = state.pendingChanges.findIndex(c => c.itemId === itemId && c.action === "edit");
      
      if (existingIdx >= 0) {
        const existing = state.pendingChanges[existingIdx];
        const prevValue = existing.newValue ? JSON.parse(existing.newValue) : {};
        const mergedValue = JSON.stringify({ ...prevValue, ...updates });
        
        const newChanges = [...state.pendingChanges];
        newChanges[existingIdx] = { ...existing, newValue: mergedValue };
        
        return { pendingChanges: newChanges };
      }

      return {
        pendingChanges: [
          ...state.pendingChanges,
          {
            action: "edit",
            itemId,
            categoryId,
            newValue: JSON.stringify(updates)
          }
        ]
      };
    }),

  removeChange: (index) =>
    set((state) => ({
      pendingChanges: state.pendingChanges.filter((_, i) => i !== index)
    })),

  clearAll: () => set({ pendingChanges: [] }),
}));
