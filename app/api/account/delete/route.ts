import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Please sign in again before deleting your account." }, { status: 401 });
    }

    const admin = createAdminClient();

    try {
      const { data: files } = await admin.storage.from("study-materials").list(user.id, { limit: 1000 });
      const paths = files?.map((file) => `${user.id}/${file.name}`) || [];

      if (paths.length > 0) {
        await admin.storage.from("study-materials").remove(paths);
      }
    } catch {
      // Account deletion should not be blocked if a storage bucket has not been created yet.
    }

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
