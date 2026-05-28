import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatMaterialSize } from "@/lib/materials";

type MaterialRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  url: string | null;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

async function getSignedUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null) {
  if (!path) return "";

  const { data } = await supabase.storage
    .from("study-materials")
    .createSignedUrl(path, 60 * 60);

  return data?.signedUrl || "";
}

async function mapMaterial(supabase: Awaited<ReturnType<typeof createClient>>, row: MaterialRow) {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    url: row.storage_path ? await getSignedUrl(supabase, row.storage_path) : row.url || "",
    desc: row.description || "",
    size: formatMaterialSize(row.size_bytes),
    mimeType: row.mime_type || undefined,
    addedAt: row.created_at,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("study_materials")
    .select("id, category, name, description, url, storage_path, mime_type, size_bytes, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const materials = await Promise.all((data || []).map((row) => mapMaterial(supabase, row as MaterialRow)));
  return NextResponse.json({ materials });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = await request.json();
  const url = String(body.url || "").trim();
  const name = String(body.name || "").trim() || url;
  const description = String(body.desc || "").trim();

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Enter a valid link." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("study_materials")
    .insert({
      user_id: user.id,
      category: "link",
      name,
      description,
      url,
    })
    .select("id, category, name, description, url, storage_path, mime_type, size_bytes, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const material = await mapMaterial(supabase, data as MaterialRow);
  return NextResponse.json({ material });
}
