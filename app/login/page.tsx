"use client";

import { useState, useTransition, useEffect } from "react";
import { loginWithName, getAllUsers } from "@/src/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Package, User } from "lucide-react";
import { useRouter } from "next/navigation";

type DBUser = {
  id: string;
  name: string;
};

export default function LoginPage() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState<DBUser[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const handleLogin = (loginName: string) => {
    if (!loginName.trim()) return;

    startTransition(async () => {
      const result = await loginWithName(loginName.trim());
      if (result.success) {
        toast.success(`Welcome, ${loginName.trim()}!`);
        router.push("/");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(name);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Package className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-headline-md font-bold font-heading">Warm Planner</h1>
          <p className="text-muted-foreground mt-2 text-center text-body-sm">
            Please sign in to view and collaborate on packing lists.
          </p>
        </div>

        {users.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Sign in as existing user:</p>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <Button
                  key={u.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleLogin(u.name)}
                  disabled={isPending}
                >
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  {u.name}
                </Button>
              ))}
            </div>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleCreateNew} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Create a new user:</p>
            <Input
              type="text"
              placeholder="Your Name (e.g. Alice)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending || !name.trim()}>
            {isPending ? "Creating..." : "Create & Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
