import { db } from "@/src/db";
import { lists, categories, items, suggestions, suggestionChanges, users } from "@/src/db/schema";
import { eq, inArray, desc, and, sql } from "drizzle-orm";
import { Sidebar } from "@/components/packing-list/sidebar";
import { SuggestionReview } from "@/components/packing-list/suggestion-review";
import { Header } from "@/components/packing-list/header";
import { getActiveUser } from "@/src/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
}

export default async function SuggestPage({
  params,
  searchParams,
}: {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { listId } = await params;
  const queryParams = await searchParams;

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

  if (activeUser.id !== list.userId) {
    redirect(`/lists/${listId}/suggest/new`);
  }

  const listCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.listId, list.id))
    .orderBy(categories.order);

  const pendingSuggestionsRaw = await db
    .select({
      id: suggestions.id,
      createdAt: suggestions.createdAt,
      authorName: users.name,
      changeCount: sql<number>`count(${suggestionChanges.id})`.mapWith(Number),
    })
    .from(suggestions)
    .leftJoin(users, eq(users.id, suggestions.userId))
    .leftJoin(suggestionChanges, eq(suggestionChanges.suggestionId, suggestions.id))
    .where(
      and(
        eq(suggestions.listId, list.id),
        eq(suggestions.status, "pending")
      )
    )
    .groupBy(suggestions.id, users.name)
    .orderBy(desc(suggestions.createdAt));

  if (pendingSuggestionsRaw.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden md:block w-64 h-full flex-shrink-0">
          <Sidebar
            categories={listCategories}
            listId={list.id}
            listTitle={list.title}
            listDescription={list.description}
            isOwner={true}
          />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">
          <Header />
          <div className="flex-1 p-12 flex flex-col items-center justify-center">
            <h2 className="text-headline-lg font-bold text-foreground">No Pending Suggestions</h2>
            <p className="text-muted-foreground mt-2">There are no pending suggestions to review.</p>
            <div className="mt-8">
              <Link
                href={`/lists/${listId}`}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeSuggestionId = queryParams?.id || pendingSuggestionsRaw[0].id;
  const activeSuggestionMeta =
    pendingSuggestionsRaw.find((s) => s.id === activeSuggestionId) || pendingSuggestionsRaw[0];

  const activeSuggestion = await db.query.suggestions.findFirst({
    where: eq(suggestions.id, activeSuggestionMeta.id),
  });

  if (!activeSuggestion) {
    return <div>Suggestion not found.</div>;
  }

  const changes = await db
    .select()
    .from(suggestionChanges)
    .where(eq(suggestionChanges.suggestionId, activeSuggestion.id));

  const categoryIds = listCategories.map((c) => c.id);
  let originalItems: typeof items.$inferSelect[] = [];
  if (categoryIds.length > 0) {
    originalItems = await db
      .select()
      .from(items)
      .where(inArray(items.categoryId, categoryIds))
      .orderBy(items.order);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block w-64 h-full flex-shrink-0 border-r border-border">
        <Sidebar
          categories={listCategories}
          listId={list.id}
          listTitle={list.title}
          listDescription={list.description}
          isOwner={true}
        />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <Header />

        <div className="flex-1 flex overflow-hidden">
          {/* Suggestions List */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-muted/20 overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-border bg-background/50 sticky top-0 backdrop-blur z-10">
              <h3 className="font-semibold text-foreground">Pending Suggestions</h3>
              <p className="text-xs text-muted-foreground">{pendingSuggestionsRaw.length} awaiting review</p>
            </div>

            <div className="p-2 space-y-2">
              {pendingSuggestionsRaw.map((s) => (
                <Link
                  key={s.id}
                  href={`/lists/${listId}/suggest?id=${s.id}`}
                  className={`block p-4 rounded-lg border transition-all ${
                    s.id === activeSuggestion.id
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{s.authorName || "Unknown User"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(s.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {s.changeCount} changes
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Suggestion Detail */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
            <SuggestionReview
              suggestion={activeSuggestion}
              changes={changes}
              categories={listCategories}
              originalItems={originalItems}
              authorName={activeSuggestionMeta.authorName || "Unknown User"}
              totalPending={pendingSuggestionsRaw.length}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
