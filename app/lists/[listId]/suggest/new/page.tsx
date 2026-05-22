import { db } from "@/src/db";
import { lists, categories, items } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Sidebar } from "@/components/packing-list/sidebar";
import { Header } from "@/components/packing-list/header";
import { SuggestModeUI } from "@/components/packing-list/suggest-mode-ui";
import { getActiveUser } from "@/src/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function NewSuggestionPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = await params;
  const activeUser = await getActiveUser();
  if (!activeUser) {
    redirect("/login");
  }

  const list = await db.query.lists.findFirst({
    where: eq(lists.id, listId),
  });

  if (!list) {
    notFound();
  }

  // Owner should just go view their own list
  if (activeUser.id === list.userId) {
    redirect(`/lists/${listId}`);
  }

  const listCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.listId, list.id))
    .orderBy(categories.order);

  const categoryIds = listCategories.map((c) => c.id);

  let allItems: typeof items.$inferSelect[] = [];
  if (categoryIds.length > 0) {
    allItems = await db
      .select()
      .from(items)
      .where(inArray(items.categoryId, categoryIds))
      .orderBy(items.order);
  }

  const categoriesWithItems = listCategories.map((cat) => ({
    ...cat,
    items: allItems.filter((i) => i.categoryId === cat.id).sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block w-64 h-full flex-shrink-0">
        <Sidebar
          categories={listCategories}
          listId={list.id}
          listTitle={list.title}
          isOwner={false}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pt-0">
          <div className="mb-8">
            <h1 className="text-headline-md font-bold">Suggest Changes</h1>
            <p className="text-muted-foreground mt-1">
              Add, edit, or remove items. Your changes won't be saved until you submit the suggestion.
            </p>
          </div>

          <SuggestModeUI categories={categoriesWithItems} listId={list.id} />
        </main>
      </div>
    </div>
  );
}
