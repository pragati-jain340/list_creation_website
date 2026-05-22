"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-provider";
import { useTransition } from "react";
import { logout } from "@/src/lib/auth";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const listId = params?.listId as string | undefined;

  const links = listId
    ? [
        { href: `/lists/${listId}`, label: "List" },
        { href: `/lists/${listId}/suggest`, label: "Suggest Changes" },
      ]
    : [];

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
    });
  };

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 px-6 mb-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-1.5 text-body-base font-medium transition-colors hover:text-primary",
            !listId ? "text-primary" : "text-muted-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {links.length > 0 && (
          <>
            <span className="text-border">/</span>
            <nav className="flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-body-base font-medium transition-colors hover:text-primary",
                    pathname === link.href
                      ? "text-primary border-b-2 border-primary py-1"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          disabled={isPending}
          className="md:hidden text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label="Sign Out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
