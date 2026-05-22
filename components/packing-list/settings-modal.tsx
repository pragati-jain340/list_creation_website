"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings, Trash2 } from "lucide-react";
import { deleteList, updateList } from "@/app/actions";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-provider";
import { useRouter } from "next/navigation";

type SettingsModalProps = {
  listId: string;
  listTitle: string;
  listDescription?: string | null;
};

export function SettingsModal({ listId, listTitle, listDescription }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(listTitle);
  const [description, setDescription] = useState(listDescription ?? "");
  const router = useRouter();

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("List title cannot be empty");
      return;
    }
    startTransition(async () => {
      const result = await updateList(listId, {
        title: title.trim(),
        description: description.trim() || null,
      });
      if (result && !result.success) {
        toast.error(result.error);
      } else {
        toast.success("List updated successfully");
        setOpen(false);
        router.refresh();
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this list? This cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteList(listId);
        if (result && !result.success) {
          toast.error(result.error);
        } else {
          toast.success("List deleted successfully");
          setOpen(false);
          router.push("/");
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-md text-body-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          <Settings size={16} className="text-muted-foreground" />
          <span>Settings</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Rename Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-title">List Title</Label>
              <Input
                id="list-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer Trip to Hawaii"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="list-description">Description (Optional)</Label>
              <Textarea
                id="list-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 7 days trip, hiking and beach"
                disabled={isPending}
                className="resize-none h-20"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={isPending || !title.trim()}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Theme Section */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Change the appearance</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-destructive mb-2">Danger Zone</h4>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isPending ? "Deleting..." : "Delete List"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
