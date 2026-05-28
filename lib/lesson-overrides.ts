import { createClient } from "@/lib/supabase/server";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

export type LessonOverride = {
  id: string;
  topicId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  videoUrl?: string;
  cheatSheetHtml?: string;
  order: number;
};

type LessonRow = {
  id: string;
  topic_id: string | null;
  module_id: string | null;
  module_title: string | null;
  title: string | null;
  video_url: string | null;
  cheat_sheet_html: string | null;
  order_index: number | null;
};

function mapRow(row: LessonRow): LessonOverride | null {
  if (!row.topic_id || !row.module_id || !row.title) return null;

  return {
    id: row.id,
    topicId: row.topic_id,
    moduleId: row.module_id,
    moduleTitle: row.module_title || "",
    title: row.title,
    videoUrl: toYouTubeEmbedUrl(row.video_url) ?? undefined,
    cheatSheetHtml: row.cheat_sheet_html || undefined,
    order: row.order_index || 0,
  };
}

export async function getLessonOverrideByTopicId(topicId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("id, topic_id, module_id, module_title, title, video_url, cheat_sheet_html, order_index")
      .eq("topic_id", topicId)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data as LessonRow);
  } catch {
    return null;
  }
}

export async function getLessonOverridesByTopicIds(topicIds: string[]) {
  if (topicIds.length === 0) return new Map<string, LessonOverride>();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lessons")
      .select("id, topic_id, module_id, module_title, title, video_url, cheat_sheet_html, order_index")
      .in("topic_id", topicIds)
      .eq("published", true);

    if (error || !data) return new Map<string, LessonOverride>();

    return new Map(
      data
        .map((row) => mapRow(row as LessonRow))
        .filter((row): row is LessonOverride => Boolean(row))
        .map((row) => [row.topicId, row])
    );
  } catch {
    return new Map<string, LessonOverride>();
  }
}
