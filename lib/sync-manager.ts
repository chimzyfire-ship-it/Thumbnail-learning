"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Checks if the remote database is accessible by making a lightweight query.
 * This is extremely useful to detect if the Supabase instance is online and has fully migrated tables.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Quick, light probe query on public.users or auth
    const { error } = await supabase.from("study_materials").select("id").limit(1);
    
    if (error) {
      console.warn("Database connection probe failed:", error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.warn("Database connection probe error:", err);
    return false;
  }
}

/**
 * Returns true if the browser has an active internet connection.
 */
export function isOnline(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.onLine;
}
