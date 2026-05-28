import { getTopicById } from "@/lib/course-data";
import { notFound } from "next/navigation";
import { CoursePlayerTemplate } from "@/components/CoursePlayerTemplate";
import type { Lesson } from "@/lib/db";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { getLessonOverrideByTopicId, getLessonOverridesByTopicIds } from "@/lib/lesson-overrides";

export default async function LearnTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const data = getTopicById(topicId);

  if (!data) {
    notFound();
  }

  const { topic, module } = data;
  const [activeOverride, moduleOverrides] = await Promise.all([
    getLessonOverrideByTopicId(topic.id),
    getLessonOverridesByTopicIds(module.topics.map((item) => item.id)),
  ]);

  if (!topic.cheatSheetHtml && !activeOverride?.cheatSheetHtml) {
    notFound();
  }

  // Map the legacy Topic data to the new dynamic Lesson format expected by the template
  const activeLesson: Lesson = {
    id: topic.id,
    moduleId: module.id,
    moduleTitle: module.title,
    title: activeOverride?.title || topic.title,
    videoUrl: activeOverride?.videoUrl || toYouTubeEmbedUrl(topic.videoUrl) || undefined,
    cheatSheetHtml: activeOverride?.cheatSheetHtml || topic.cheatSheetHtml || `<h2>Lab Notes: ${topic.title}</h2><p>${topic.description}</p>`,
    order: topic.number,
    completed: topic.completed,
  };

  const moduleLessons: Lesson[] = module.topics.map((t) => ({
    id: t.id,
    moduleId: module.id,
    moduleTitle: module.title,
    title: moduleOverrides.get(t.id)?.title || t.title,
    videoUrl: moduleOverrides.get(t.id)?.videoUrl || toYouTubeEmbedUrl(t.videoUrl) || undefined,
    cheatSheetHtml: moduleOverrides.get(t.id)?.cheatSheetHtml || t.cheatSheetHtml || "",
    order: t.number,
    completed: t.completed,
  }));

  return (
    <div className="max-w-7xl mx-auto w-full h-[calc(100vh-8rem)]">
      <CoursePlayerTemplate 
        activeLesson={activeLesson} 
        moduleLessons={moduleLessons} 
        linkPrefix="learn" 
      />
    </div>
  );
}
