import { z } from "zod";

export const itemSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  categoryId: z.string().uuid("Pick a category"),
  quantity: z.number().min(1).max(99),
  notes: z.string().max(500).optional().nullable(),
});

export const categorySchema = z.object({
  listId: z.string().uuid("List ID required"),
  name: z.string().min(1, "Name required").max(50),
  icon: z.string().min(1, "Icon required"),
});

export const listSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  description: z.string().max(300).optional().nullable(),
  tripStart: z.date().optional().nullable(),
  tripEnd: z.date().optional().nullable(),
}).refine(data => 
  !data.tripStart || !data.tripEnd || data.tripEnd >= data.tripStart, 
  { message: "End date must be at or after start date", path: ["tripEnd"] }
);

export type PendingChange = {
  itemId?: string;
  action: "add" | "remove" | "edit";
  categoryId?: string;
  newValue?: string; // JSON string for new or edited item
};

export const suggestionSchema = z.object({
  listId: z.string().uuid("List ID required"),
  message: z.string().optional().nullable(),
  changes: z.array(z.object({
    itemId: z.string().optional(),
    action: z.enum(["add", "remove", "edit"]),
    categoryId: z.string().optional(),
    newValue: z.string().optional(),
  })),
});
