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
import { createItem } from "@/app/actions";
import { itemSchema } from "@/src/lib/validations";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
};

export function AddItemModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      quantity: 1,
      notes: "",
      categoryId: categories[0]?.id || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof itemSchema>) => {
    const result = await createItem(values);
    if (result && !result.success) {
      toast.error(result.error);
    } else {
      form.reset();
      setOpen(false);
      toast.success("Item added successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0 md:relative md:h-10 md:w-auto md:rounded-md md:px-4 md:py-2 md:bottom-auto md:right-auto md:shadow-none">
          <Plus className="h-6 w-6 md:mr-2 md:h-4 md:w-4" />
          <span className="hidden md:inline">Add Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Name</label>
            <Input {...form.register("title")} placeholder="e.g., Passport" />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              {...form.register("categoryId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input type="number" min={1} {...form.register("quantity", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea {...form.register("notes")} placeholder="e.g., Make sure it's valid for 6 months" />
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
