import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatMaterialSize, getMaterialCategory } from "@/lib/materials";

const allowedTypes = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "audio/x-m4a",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
];

const allowedExts = [
  "pdf", "txt", "md", "csv", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
  "png", "jpg", "jpeg", "webp", "gif", "svg", "mp3", "m4a", "wav", "ogg",
  "mp4", "mov", "webm", "avi",
];

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type. Use PDF, Word, PowerPoint, Excel, images, audio, video, or text." }, { status: 400 });
    }

    const isVideo = file.type.startsWith("video/") || ["mp4", "mov", "webm", "avi"].includes(ext);
    const maxSize = isVideo ? 200 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB for this file type.` }, { status: 400 });
    }

    const category = getMaterialCategory(file.name, file.type);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("study-materials")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from("study-materials")
      .createSignedUrl(uploadData.path, 60 * 60);

    if (signedError) {
      await supabase.storage.from("study-materials").remove([uploadData.path]);
      return NextResponse.json({ error: signedError.message }, { status: 500 });
    }

    const { data: material, error: dbError } = await supabase
      .from("study_materials")
      .insert({
        user_id: user.id,
        category,
        name: file.name,
        description: `Added ${new Date().toLocaleDateString()}`,
        storage_path: uploadData.path,
        mime_type: file.type || null,
        size_bytes: file.size,
      })
      .select("id, category, name, description, mime_type, size_bytes, created_at")
      .single();

    if (dbError) {
      await supabase.storage.from("study-materials").remove([uploadData.path]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      material: {
        id: material.id,
        category: material.category,
        name: material.name,
        url: signedData.signedUrl,
        desc: material.description || "",
        size: formatMaterialSize(material.size_bytes),
        mimeType: material.mime_type || undefined,
        addedAt: material.created_at,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
