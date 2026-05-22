"use server";

import { db } from "@/src/db";
import { items, categories, lists, suggestions, suggestionChanges, users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { itemSchema, categorySchema, listSchema, suggestionSchema, PendingChange } from "@/src/lib/validations";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getActiveUser } from "@/src/lib/auth";

// Generic wrapper for standard response
async function withErrorHandling<T>(action: () => Promise<T>) {
  try {
    await action();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}

// FUNCTION 1 — Toggle Item
export async function toggleItem(id: string, completed: boolean) {
  return withErrorHandling(async () => {
    await db.update(items).set({ completed }).where(eq(items.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 2 — Create Item
export async function createItem(data: z.infer<typeof itemSchema>) {
  return withErrorHandling(async () => {
    const validatedData = itemSchema.parse(data);
    const existingItems = await db.select().from(items).where(eq(items.categoryId, validatedData.categoryId));
    const maxOrder = existingItems.reduce((max, item) => Math.max(max, item.order), 0);

    // Hardcoding user ID for now since no auth is implemented
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Unauthorized");

    await db.insert(items).values({
      categoryId: validatedData.categoryId,
      title: validatedData.title,
      quantity: validatedData.quantity,
      notes: validatedData.notes,
      completed: false,
      order: maxOrder + 1,
      createdBy: activeUser.id,
    });
    revalidatePath("/");
  });
}

// FUNCTION 3 — Delete Item
export async function deleteItem(id: string) {
  return withErrorHandling(async () => {
    await db.delete(items).where(eq(items.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 4 — Edit Item
export async function updateItem(id: string, data: { title?: string, quantity?: number, notes?: string }) {
  return withErrorHandling(async () => {
    await db.update(items).set(data).where(eq(items.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 5 — Create Category
export async function createCategory(data: z.infer<typeof categorySchema>) {
  return withErrorHandling(async () => {
    const validatedData = categorySchema.parse(data);
    const existingCategories = await db.select().from(categories).where(eq(categories.listId, validatedData.listId));
    const maxOrder = existingCategories.reduce((max, cat) => Math.max(max, cat.order), 0);

    await db.insert(categories).values({
      listId: validatedData.listId,
      name: validatedData.name,
      icon: validatedData.icon,
      order: maxOrder + 1,
    });
    revalidatePath("/");
  });
}

// FUNCTION 5.1 — Update Category Icon
export async function updateCategoryIcon(id: string, icon: string) {
  return withErrorHandling(async () => {
    await db.update(categories).set({ icon }).where(eq(categories.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 6 — Delete Category
export async function deleteCategory(id: string) {
  return withErrorHandling(async () => {
    await db.delete(items).where(eq(items.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 7 — Drag & Drop Items
export async function reorderItems(updates: { id: string, order: number }[]) {
  return withErrorHandling(async () => {
    for (const { id, order } of updates) {
      await db.update(items).set({ order }).where(eq(items.id, id));
    }
    revalidatePath("/");
  });
}

// FUNCTION 8 — Create Suggestion
export async function createSuggestion(data: z.infer<typeof suggestionSchema>) {
  return withErrorHandling(async () => {
    const validatedData = suggestionSchema.parse(data);
    
    // Hardcode user for now
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Unauthorized");

    const [suggestion] = await db
      .insert(suggestions)
      .values({
        listId: validatedData.listId,
        userId: activeUser.id,
        message: validatedData.message,
        status: 'pending',
      })
      .returning();

    await db.insert(suggestionChanges).values(
      validatedData.changes.map(change => ({
        suggestionId: suggestion.id,
        itemId: change.itemId ?? null,
        action: change.action,
        categoryId: change.categoryId ?? null,
        newValue: change.newValue ?? null,
      }))
    );
    revalidatePath("/");
    revalidatePath("/suggest");
  });
}

// FUNCTION 10 — Accept All Changes
export async function acceptAllChanges(suggestionId: string) {
  return withErrorHandling(async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Unauthorized");

    const suggestion = await db.query.suggestions.findFirst({
      where: eq(suggestions.id, suggestionId),
    });
    if (!suggestion) throw new Error("Suggestion not found");

    const list = await db.query.lists.findFirst({
      where: eq(lists.id, suggestion.listId),
    });
    if (!list || list.userId !== activeUser.id) throw new Error("Unauthorized");

    const changes = await db.select().from(suggestionChanges).where(eq(suggestionChanges.suggestionId, suggestionId));

    for (const change of changes) {
      if (change.action === "add" && change.newValue) {
        const parsed = JSON.parse(change.newValue);
        await db.insert(items).values({
          categoryId: change.categoryId!,
          title: parsed.title,
          quantity: parsed.quantity || 1,
          completed: false,
          order: 999,
          createdBy: activeUser.id,
        });
      } else if (change.action === "remove" && change.itemId) {
        // Delete all suggestion_changes referencing this item first (FK constraint)
        await db.delete(suggestionChanges).where(eq(suggestionChanges.itemId, change.itemId));
        await db.delete(items).where(eq(items.id, change.itemId));
      } else if (change.action === "edit" && change.itemId && change.newValue) {
        const parsed = JSON.parse(change.newValue);
        await db.update(items).set({
          title: parsed.title,
          quantity: parsed.quantity,
          notes: parsed.notes,
        }).where(eq(items.id, change.itemId));
      }
    }

    // Clean up any remaining changes for this suggestion, then mark accepted
    await db.delete(suggestionChanges).where(eq(suggestionChanges.suggestionId, suggestionId));
    await db.update(suggestions).set({ status: "accepted" }).where(eq(suggestions.id, suggestionId));
    revalidatePath("/");
    revalidatePath("/suggest");
  });
}

// FUNCTION 11 — Reject All Changes
export async function rejectAllChanges(suggestionId: string) {
  return withErrorHandling(async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Unauthorized");

    const suggestion = await db.query.suggestions.findFirst({
      where: eq(suggestions.id, suggestionId),
    });
    if (!suggestion) throw new Error("Suggestion not found");

    const list = await db.query.lists.findFirst({
      where: eq(lists.id, suggestion.listId),
    });
    if (!list || list.userId !== activeUser.id) throw new Error("Unauthorized");

    await db.update(suggestions).set({ status: "rejected" }).where(eq(suggestions.id, suggestionId));
    revalidatePath("/");
  });
}

// FUNCTION 12 — Create List
export async function createList(data: z.infer<typeof listSchema>) {
  const validatedData = listSchema.parse(data);
  const activeUser = await getActiveUser();
  if (!activeUser) throw new Error("Unauthorized");
  
  const [list] = await db
    .insert(lists)
    .values({
      ...validatedData,
      userId: activeUser.id,
    })
    .returning();

  redirect(`/lists/${list.id}`);
}

// FUNCTION 13 — Delete List
export async function deleteList(id: string) {
  return withErrorHandling(async () => {
    // Delete categories -> items -> suggestion changes -> suggestions
    const listCategories = await db.select().from(categories).where(eq(categories.listId, id));
    for (const cat of listCategories) {
      await db.delete(items).where(eq(items.categoryId, cat.id));
    }
    await db.delete(categories).where(eq(categories.listId, id));
    
    const listSuggestions = await db.select().from(suggestions).where(eq(suggestions.listId, id));
    for (const sug of listSuggestions) {
      await db.delete(suggestionChanges).where(eq(suggestionChanges.suggestionId, sug.id));
    }
    await db.delete(suggestions).where(eq(suggestions.listId, id));

    await db.delete(lists).where(eq(lists.id, id));
    revalidatePath("/");
  });
}

// FUNCTION 14 — Update List
export async function updateList(id: string, data: { title: string; description?: string | null }) {
  return withErrorHandling(async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Unauthorized");

    const list = await db.query.lists.findFirst({
      where: eq(lists.id, id),
    });
    if (!list || list.userId !== activeUser.id) throw new Error("Unauthorized");

    await db
      .update(lists)
      .set({
        title: data.title,
        description: data.description,
      })
      .where(eq(lists.id, id));

    revalidatePath("/");
    revalidatePath(`/lists/${id}`);
  });
}

// FUNCTION 15 — Delete Account
export async function deleteAccount() {
  return withErrorHandling(async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) throw new Error("Not logged in");

    const userId = activeUser.id;

    // 1. Delete all lists owned by the user (cascades to categories, items, suggestions)
    const userLists = await db.select().from(lists).where(eq(lists.userId, userId));
    for (const list of userLists) {
      // Delete suggestion changes -> suggestions for this list
      const listSuggestions = await db.select().from(suggestions).where(eq(suggestions.listId, list.id));
      for (const sug of listSuggestions) {
        await db.delete(suggestionChanges).where(eq(suggestionChanges.suggestionId, sug.id));
      }
      await db.delete(suggestions).where(eq(suggestions.listId, list.id));

      // Delete items -> categories
      const listCategories = await db.select().from(categories).where(eq(categories.listId, list.id));
      for (const cat of listCategories) {
        await db.delete(items).where(eq(items.categoryId, cat.id));
      }
      await db.delete(categories).where(eq(categories.listId, list.id));
    }
    await db.delete(lists).where(eq(lists.userId, userId));

    // 2. Delete suggestions the user submitted (on other people's lists)
    const userSuggestions = await db.select().from(suggestions).where(eq(suggestions.userId, userId));
    for (const sug of userSuggestions) {
      await db.delete(suggestionChanges).where(eq(suggestionChanges.suggestionId, sug.id));
    }
    await db.delete(suggestions).where(eq(suggestions.userId, userId));

    // 3. Delete the user record itself
    await db.delete(users).where(eq(users.id, userId));

    // 4. Clear session cookie
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("userId");

    revalidatePath("/");
  });
}
