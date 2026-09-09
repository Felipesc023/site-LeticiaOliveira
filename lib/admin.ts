import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/config";
import type { User } from "@supabase/supabase-js";

/** Returns the signed-in admin, or null. Use in API routes / server actions. */
export async function getAdmin(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return isAdminEmail(user?.email) ? user : null;
}

/** Same, but redirects to the login screen when not an admin. Use in pages. */
export async function requireAdmin(): Promise<User> {
  const user = await getAdmin();
  if (!user) redirect("/entrar");
  return user;
}
