import { getLesson, getModuleLessons } from "@/lib/db";
import { CoursePlayerTemplate } from "@/components/CoursePlayerTemplate";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;

  const [activeLesson, moduleLessons] = await Promise.all([
    getLesson(moduleId, lessonId),
    getModuleLessons(moduleId),
  ]);

  if (!activeLesson) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <CoursePlayerTemplate
        activeLesson={activeLesson}
        moduleLessons={moduleLessons}
      />
    </div>
  );
}
