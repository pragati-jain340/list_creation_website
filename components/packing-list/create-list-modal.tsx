"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createList } from "@/app/actions";
import { listSchema } from "@/src/lib/validations";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export function CreateListModal() {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof listSchema>>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof listSchema>) => {
    // createList redirects so we don't need to manually reset or show success if it navigates away
    // Wait, createList might return an error
    try {
      await createList(values);
      // If redirect happens, the below code might not run, which is fine
      form.reset();
      setOpen(false);
      toast.success("List created successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to create list");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">List Title</Label>
            <Input {...form.register("title")} placeholder="e.g., Summer Trip to Hawaii" disabled={form.formState.isSubmitting} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea {...form.register("description")} placeholder="e.g., 7 days trip, hiking and beach" disabled={form.formState.isSubmitting} />
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create List"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
