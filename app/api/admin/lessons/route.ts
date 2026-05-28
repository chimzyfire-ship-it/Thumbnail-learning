import { NextRequest, NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin";
import { courseData } from "@/lib/course-data";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

const COURSE_ID = "aaaaaaaa-0000-0000-0000-000000000001";

function findTopic(moduleId: string, topicId: string) {
  for (const tier of courseData) {
    const courseModule = tier.modules.find((item) => item.id === moduleId);
    const topic = courseModule?.topics.find((item) => item.id === topicId);

    if (courseModule && topic) {
      return { module: courseModule, topic };
    }
  }

  return null;
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: NextResponse.json({ error: "Please sign in." }, { status: 401 }) };
  }

  if (!isAdminUser(user)) {
    return { user: null, error: NextResponse.json({ error: "You do not have admin access." }, { status: 403 }) };
  }

  return { user, error: null };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("lessons")
      .select("id, topic_id, module_id, module_title, title, video_url, cheat_sheet_html, order_index, created_at")
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lessons: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load lessons.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const moduleId = String(body.moduleId || "");
    const topicId = String(body.topicId || "");
    const title = String(body.title || "").trim();
    const videoUrl = String(body.videoUrl || "").trim();
    const cheatSheetHtml = String(body.cheatSheetHtml || "").trim();
    const lookup = findTopic(moduleId, topicId);

    if (!lookup) {
      return NextResponse.json({ error: "Choose a valid course topic." }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Lesson title is required." }, { status: 400 });
    }

    const normalizedVideoUrl = videoUrl ? toYouTubeEmbedUrl(videoUrl) : null;
    if (videoUrl && !normalizedVideoUrl) {
      return NextResponse.json({ error: "Paste a valid YouTube video link." }, { status: 400 });
    }

    const admin = createAdminClient();
    const payload = {
      course_id: COURSE_ID,
      topic_id: topicId,
      module_id: moduleId,
      module_title: lookup.module.title,
      title,
      video_url: normalizedVideoUrl,
      cheat_sheet_html: cheatSheetHtml || lookup.topic.cheatSheetHtml || "",
      transcript: null,
      order_index: lookup.topic.number,
      published: true,
    };

    const { data: existing, error: existingError } = await admin
      .from("lessons")
      .select("id")
      .eq("topic_id", topicId)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    const query = existing
      ? admin.from("lessons").update(payload).eq("id", existing.id).select("id").single()
      : admin.from("lessons").insert(payload).select("id").single();

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not publish lesson.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
