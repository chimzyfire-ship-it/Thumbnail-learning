"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { courseData } from "@/lib/course-data";

const availableModules = courseData.flatMap((tier) => tier.modules);

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function AdminUploadPage() {
  const [moduleId, setModuleId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [cheatSheetHtml, setCheatSheetHtml] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const selectedModule = availableModules.find((module) => module.id === moduleId);
  const selectedTopic = selectedModule?.topics.find((topic) => topic.id === topicId);

  const handleTopicChange = (nextTopicId: string) => {
    const topic = selectedModule?.topics.find((item) => item.id === nextTopicId);

    setTopicId(nextTopicId);
    setTitle(topic?.title || "");
    setVideoUrl(topic?.videoUrl || "");
    setCheatSheetHtml(topic?.cheatSheetHtml || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      moduleId,
      topicId,
      title,
      videoUrl,
      cheatSheetHtml,
    };

    try {
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not publish lesson.");
      }

      setStatus("success");
      setModuleId("");
      setTopicId("");
      setTitle("");
      setVideoUrl("");
      setCheatSheetHtml("");

      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to publish. Check console for details.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-8">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Upload</h1>
            <p className="text-muted-foreground text-sm">Attach the right video and lab notes to each course lesson.</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle>Course Lesson</CardTitle>
            <CardDescription>Choose the exact lesson learners should see, then publish the video and notes for it.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Module Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Module</label>
                <select
                  value={moduleId}
                  onChange={(e) => {
                    setModuleId(e.target.value);
                    setTopicId("");
                    setTitle("");
                    setVideoUrl("");
                    setCheatSheetHtml("");
                  }}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose a module...</option>
                  {availableModules.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Course Lesson</label>
                <select
                  value={topicId}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  required
                  disabled={!selectedModule}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition appearance-none cursor-pointer disabled:opacity-60"
                >
                  <option value="" disabled>{selectedModule ? "Choose a lesson..." : "Choose a module first..."}</option>
                  {selectedModule?.topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      Topic {topic.number}: {topic.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lesson Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Lesson Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Power of Screenshots"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition placeholder:text-muted-foreground/50"
                />
              </div>

              {/* YouTube Video URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">YouTube Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition placeholder:text-muted-foreground/50"
                />
                <p className="text-xs text-muted-foreground">
                  Paste a normal YouTube link, shorts link, share link, or embed link. The platform will place the right video inside the lesson player automatically.
                </p>
              </div>

              {/* Lab Notes / Cheat Sheet */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Lab Notes / Cheat Sheet (HTML)</label>
                <textarea
                  value={cheatSheetHtml}
                  onChange={(e) => setCheatSheetHtml(e.target.value)}
                  placeholder="<h2>Lab Notes</h2><p>Enter your lesson notes in HTML...</p>"
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-y font-mono placeholder:text-muted-foreground/50"
                />
                <p className="text-xs text-muted-foreground">
                  Supports HTML tags: <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;h2&gt;</code>, <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;ul&gt;</code>, <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;ol&gt;</code>, <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;blockquote&gt;</code>, <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;code&gt;</code>, <code className="text-cyan-400 bg-secondary px-1 rounded">&lt;table&gt;</code>, etc.
                </p>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 gap-2"
                >
                  {status === "submitting" ? (
                    <>Publishing...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Publish to Course
                    </>
                  )}
                </Button>

                {status === "success" && (
                  <span className="flex items-center gap-2 text-green-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Lesson published successfully.
                  </span>
                )}
                {status === "error" && (
                  <span className="flex items-center gap-2 text-red-400 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                  </span>
                )}
              </div>

              {selectedTopic && (
                <p className="text-xs text-muted-foreground">
                  This will update the lesson learners open from the normal course tab: <span className="text-primary font-semibold">{selectedTopic.title}</span>.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
