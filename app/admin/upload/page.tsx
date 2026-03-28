"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Upload, CheckCircle2, AlertCircle } from "lucide-react";

const availableModules = [
  { id: "module-a", title: "Module A: Talking to AI the Right Way" },
  { id: "module-b", title: "Module B: Fixing Everyday Problems" },
  { id: "module-c", title: "Module C: Making It Work for Us (Local Focus)" },
  { id: "module-d", title: "Module D: Spotting Mistakes and Fixing Them" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function AdminUploadPage() {
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [cheatSheetHtml, setCheatSheetHtml] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      moduleId,
      title,
      videoUrl,
      cheatSheetHtml,
    };

    try {
      // ── Replace with your Server Action or API route ──
      // Example: await publishLesson(payload);
      // For now, simulate a network call:
      console.log("Publishing lesson:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
      // Reset form
      setModuleId("");
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
            <p className="text-muted-foreground text-sm">Publish new lessons to the Thumbnail Learning platform.</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader>
            <CardTitle>New Lesson</CardTitle>
            <CardDescription>Fill in the details below and hit Publish when ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Module Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Module</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
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

              {/* YouTube Embed URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">YouTube Embed URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition placeholder:text-muted-foreground/50"
                />
                <p className="text-xs text-muted-foreground">
                  Use the embed URL format: <code className="text-cyan-400 bg-secondary px-1 rounded">https://www.youtube.com/embed/VIDEO_ID</code>
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
                  required
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
                      <Upload className="w-4 h-4" /> Publish Lesson
                    </>
                  )}
                </Button>

                {status === "success" && (
                  <span className="flex items-center gap-2 text-green-500 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Lesson published successfully!
                  </span>
                )}
                {status === "error" && (
                  <span className="flex items-center gap-2 text-red-400 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
