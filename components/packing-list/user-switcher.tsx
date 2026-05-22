"use client";

import { useEffect, useState, useTransition } from "react";
import { getActiveUser, logout } from "@/src/lib/auth";
import { deleteAccount } from "@/app/actions";
import { LogOut, User, Trash2, AlertTriangle, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type DBUser = {
  id: string;
  name: string;
  email: string;
};

type UserSwitcherProps = {
  compact?: boolean;
};

export function UserSwitcher({ compact = false }: UserSwitcherProps) {
  const [activeUser, setCurrentUser] = useState<DBUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getActiveUser().then((user) => {
      setCurrentUser(user as DBUser);
    });
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      const result = await deleteAccount();
      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success("Account deleted successfully");
        setIsDeleteOpen(false);
        router.push("/login");
      }
    });
  };

  if (!activeUser) return null;

  // Compact mode: icon button + dropdown (used in mobile header)
  if (compact) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              aria-label="User menu"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[11px] font-bold text-primary">
                  {activeUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-52">
            <div className="px-3 py-2 border-b border-border/50">
              <p className="font-semibold text-sm text-foreground truncate">{activeUser.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{activeUser.email}</p>
            </div>
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className="gap-2 mt-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsDeleteOpen(true)}
              disabled={isPending}
              className="gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteAccountDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          userName={activeUser.name}
          isPending={isPending}
          onDelete={handleDeleteAccount}
        />
      </>
    );
  }

  // Full mode: sidebar/panel view
  return (
    <>
      <div className="flex flex-col gap-1">
        {/* User Info */}
        <div className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-md text-body-sm font-medium text-sidebar-foreground">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {activeUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col flex-1 truncate">
            <span className="truncate font-semibold">{activeUser.name}</span>
            <span className="text-[10px] text-muted-foreground truncate">{activeUser.email}</span>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-md text-body-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <LogOut size={14} />
          <span>{isPending ? "Signing out..." : "Sign Out"}</span>
        </button>

        {/* Delete Account */}
        <button
          onClick={() => setIsDeleteOpen(true)}
          disabled={isPending}
          className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-md text-body-sm font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={14} />
          <span>Delete Account</span>
        </button>
      </div>

      <DeleteAccountDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        userName={activeUser.name}
        isPending={isPending}
        onDelete={handleDeleteAccount}
      />
    </>
  );
}

function DeleteAccountDialog({
  open,
  onOpenChange,
  userName,
  isPending,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userName: string;
  isPending: boolean;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-medium text-destructive mb-1">
              This action cannot be undone.
            </p>
            <p className="text-sm text-muted-foreground">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-muted-foreground list-disc ml-4 mt-2 space-y-1">
              <li>All your packing lists and their items</li>
              <li>All suggestions you've submitted</li>
              <li>Your account and profile data</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Logged in as <span className="font-semibold text-foreground">{userName}</span>.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
