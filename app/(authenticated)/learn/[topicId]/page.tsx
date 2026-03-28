import { getTopicById } from "@/lib/course-data";
import { notFound } from "next/navigation";
import { CoursePlayerTemplate } from "@/components/CoursePlayerTemplate";
import type { Lesson } from "@/lib/db";

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

  const { topic, module, tier } = data;

  // Map the legacy Topic data to the new dynamic Lesson format expected by the template
  const activeLesson: Lesson = {
    id: topic.id,
    moduleId: module.id,
    moduleTitle: module.title,
    title: topic.title,
    videoUrl: topic.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cheatSheetHtml: topic.cheatSheetHtml || `<h2>Lab Notes: ${topic.title}</h2><p>${topic.description}</p>`,
    order: topic.number,
    completed: topic.completed,
  };

  const moduleLessons: Lesson[] = module.topics.map((t) => ({
    id: t.id,
    moduleId: module.id,
    moduleTitle: module.title,
    title: t.title,
    videoUrl: t.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cheatSheetHtml: t.cheatSheetHtml || "",
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
