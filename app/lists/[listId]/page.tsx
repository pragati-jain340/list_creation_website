import { db } from "@/src/db";
import { lists, categories, items } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Sidebar } from "@/components/packing-list/sidebar";
import { CategoryCard } from "@/components/packing-list/category-card";
import { AddItemModal } from "@/components/packing-list/add-item-modal";
import { Header } from "@/components/packing-list/header";
import { EditableTitle } from "@/components/packing-list/editable-title";
import { getActiveUser } from "@/src/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function ListPage({
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

  const isOwner = activeUser.id === list.userId;

  if (!isOwner) {
    redirect(`/lists/${listId}/suggest/new`);
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
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full flex-shrink-0">
        <Sidebar
          categories={listCategories}
          listId={list.id}
          listTitle={list.title}
          listDescription={list.description}
          isOwner={isOwner}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pt-0">

          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              {isOwner ? (
                <EditableTitle
                  listId={list.id}
                  title={list.title}
                  description={list.description}
                />
              ) : (
                <h1 className="text-headline-xl font-heading font-bold text-foreground mb-2">
                  {list.title}
                </h1>
              )}
              {list.description && (
                <p className="text-body-base text-muted-foreground mt-1">
                  {list.description}
                </p>
              )}
            </div>

            <div className="hidden md:block">
              <AddItemModal categories={listCategories} />
            </div>
          </header>

          <div className="md:hidden mb-6">
            <AddItemModal categories={listCategories} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categoriesWithItems.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                iconName={cat.icon}
                items={cat.items}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
