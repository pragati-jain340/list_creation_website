"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/app/actions";
import { Plus } from "lucide-react";
import { iconMap } from "@/src/lib/iconMap";
import { categorySchema } from "@/src/lib/validations";
import { toast } from "sonner";

type AddCategoryModalProps = {
  listId: string;
};

export function AddCategoryModal({ listId }: AddCategoryModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      listId: listId,
      name: "",
      icon: "laptop",
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const result = await createCategory(values);
    if (result && !result.success) {
      toast.error(result.error);
    } else {
      form.reset({ listId, name: "", icon: "laptop" });
      setOpen(false);
      toast.success("Category created successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 justify-start border-dashed">
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g. Photography"
              disabled={form.formState.isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(iconMap).map((iconName) => {
                const Icon = iconMap[iconName as keyof typeof iconMap];
                const selectedIcon = form.watch("icon");
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => form.setValue("icon", iconName)}
                    className={`p-2 rounded-md border ${
                      selectedIcon === iconName
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting} className="mt-2">
            {form.formState.isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
