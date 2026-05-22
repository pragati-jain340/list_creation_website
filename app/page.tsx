import { db } from "@/src/db";
import { lists, users, categories, items, suggestions } from "@/src/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getActiveUser, logout } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { CreateListModal } from "@/components/packing-list/create-list-modal";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-provider";
import { UserSwitcher } from "@/components/packing-list/user-switcher";
import {
  ListTodo,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  MessageSquare,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
}

export default async function DashboardPage() {
  const activeUser = await getActiveUser();
  if (!activeUser) {
    redirect("/login");
  }

  // Fetch all lists with owner info, category count, item count, pending suggestion count
  const allListsRaw = await db
    .select({
      id: lists.id,
      title: lists.title,
      description: lists.description,
      createdAt: lists.createdAt,
      userId: lists.userId,
      ownerName: users.name,
    })
    .from(lists)
    .leftJoin(users, eq(users.id, lists.userId))
    .orderBy(desc(lists.createdAt));

  // Enrich with counts
  const enrichedLists = await Promise.all(
    allListsRaw.map(async (list) => {
      const [catCount] = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(categories)
        .where(eq(categories.listId, list.id));

      const [pendingCount] = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(suggestions)
        .where(eq(suggestions.listId, list.id));

      const [itemCount] = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(items)
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(eq(categories.listId, list.id));

      const [completedCount] = await db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(items)
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .where(eq(categories.listId, list.id));

      return {
        ...list,
        categoryCount: catCount?.count ?? 0,
        pendingCount: pendingCount?.count ?? 0,
        itemCount: itemCount?.count ?? 0,
      };
    })
  );

  const myLists = enrichedLists.filter((l) => l.userId === activeUser.id);
  const otherLists = enrichedLists.filter((l) => l.userId !== activeUser.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-3.5 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <ListTodo className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-lg text-foreground tracking-tight">
            Warm Planner
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile user menu */}
          <div className="md:hidden">
            <UserSwitcher compact />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="relative mb-10 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-2xl" />
          <div className="absolute top-4 right-6 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
          <div className="relative p-8 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👋</span>
              <p className="text-sm font-medium text-primary/80 uppercase tracking-wider">
                Welcome back
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              {activeUser.name}
            </h2>
            <p className="text-base text-muted-foreground max-w-lg">
              Manage your packing lists, organize items by category, and collaborate with others through suggestions.
            </p>
            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{myLists.length}</span> {myLists.length === 1 ? 'list' : 'lists'}
                </span>
              </div>
              {otherLists.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{otherLists.length}</span> shared
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Lists */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Layers className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                My Packing Lists
              </h3>
            </div>
            <CreateListModal />
          </div>

          {myLists.length === 0 ? (
            <div className="border-2 border-dashed border-border/60 rounded-2xl p-14 text-center flex flex-col items-center gap-5 bg-muted/20">
              <div className="p-4 bg-muted/40 rounded-full">
                <ListTodo className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">No lists yet</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                  Create your first packing list to start organizing your trips and adventures.
                </p>
              </div>
              <CreateListModal />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/lists/${list.id}`}
                  className="group relative bg-card border border-border/60 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-3 hover:-translate-y-0.5"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {list.title}
                      </h4>
                      {list.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{list.description}</p>
                      )}
                    </div>
                    <div className="p-1.5 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200 flex-shrink-0">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="relative flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/40">
                    <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md">
                      <Layers className="h-3 w-3" />
                      {list.categoryCount}
                    </span>
                    <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      {list.itemCount} items
                    </span>
                    {list.pendingCount > 0 && (
                      <span className="flex items-center gap-1.5 bg-primary/10 text-primary font-semibold px-2 py-1 rounded-md animate-pulse">
                        <MessageSquare className="h-3 w-3" />
                        {list.pendingCount}
                      </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto text-[11px]">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(list.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Other Lists */}
        {otherLists.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <MessageSquare className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Shared With You
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 ml-10">
              These lists belong to other users. You can suggest item additions, edits, or removals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherLists.map((list) => (
                <Link
                  key={list.id}
                  href={`/lists/${list.id}/suggest/new`}
                  className="group relative bg-card border border-border/60 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-3 hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {list.title}
                      </h4>
                      {list.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{list.description}</p>
                      )}
                    </div>
                    <div className="p-1.5 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-200 flex-shrink-0">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                  </div>

                  <div className="relative flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">
                          {list.ownerName?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-foreground/70">{list.ownerName}</span>
                    </span>
                    <span className="flex items-center gap-1 ml-auto text-[11px]">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(list.createdAt)}
                    </span>
                  </div>

                  <div className="relative text-xs bg-primary/10 text-primary rounded-lg px-3 py-1.5 font-semibold text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    Suggest Changes →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fixed bottom-left user panel — desktop only */}
      <div className="hidden md:block fixed bottom-0 left-0 z-50 p-4 w-64">
        <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-3 shadow-lg">
          <UserSwitcher />
        </div>
      </div>
    </div>
  );
}
