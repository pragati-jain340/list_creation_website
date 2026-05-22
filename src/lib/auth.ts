"use server";

import { cookies } from "next/headers";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getActiveUser() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId");

  if (userIdCookie?.value) {
    const user = await db.select().from(users).where(eq(users.id, userIdCookie.value)).limit(1);
    if (user.length > 0) return user[0];
  }

  return null;
}

export async function loginWithName(name: string) {
  if (!name.trim()) return { success: false, error: "Name is required" };
  
  const existingUser = await db.select().from(users).where(eq(users.name, name)).limit(1);
  let userId;
  
  if (existingUser.length > 0) {
    userId = existingUser[0].id;
  } else {
    const [newUser] = await db.insert(users).values({
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
    }).returning();
    userId = newUser.id;
  }
  
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, { maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/");
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  revalidatePath("/");
}

export async function getAllUsers() {
  return await db.select().from(users);
}
