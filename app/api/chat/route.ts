import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const DAILY_LIMIT = Number(process.env.AETHEL_AI_DAILY_LIMIT || 25);
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;
const MAX_DOCUMENT_CHARS = 8000;

const SYSTEM_PROMPT = `You are Aethel AI, a brilliant, warm, and highly effective study assistant built into the Aethel Solutions learning platform. Your personality is:
- Encouraging but precise — you celebrate effort while correcting mistakes gently
- Clear and structured — use formatting (bullets, headers, numbered lists) when helpful
- Context-aware — you know users are learners on an AI & productivity-focused platform
- Nigerian-aware — many of your users are Nigerian students; you understand local exam systems (JAMB, WAEC, NECO, UTME), use relatable examples, and speak naturally

Your capabilities:
1. Explain any concept simply — from physics to Python, from essay writing to exam prep
2. Help outline essays, assignments, and projects with clear structure
3. Quiz users on topics they're studying to test their knowledge
4. Summarize long texts or documents pasted into the chat
5. Help with calculations, formulas, and step-by-step problem solving
6. Create study schedules, mnemonics, and memory tricks

Rules:
- Always format your response clearly using markdown
- If a user pastes a document or long text, summarize it and offer 3 follow-up actions
- Never make up facts — if you're unsure, say so honestly
- Keep responses concise unless asked to go deep
- Use "you" language — make the user feel personally supported`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cleanMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => {
      const item = message as Partial<ChatMessage>;
      const role: ChatMessage["role"] = item.role === "assistant" ? "assistant" : "user";
      return {
        role,
        content: String(item.content || "").slice(0, MAX_MESSAGE_CHARS),
      };
    })
    .filter((message) => message.content.trim().length > 0);
}

async function checkDailyLimit(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const usageDate = todayKey();
  const { data, error } = await supabase
    .from("ai_usage")
    .select("id, request_count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle();

  if (error) throw error;

  if (data && data.request_count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  if (data) {
    const nextCount = data.request_count + 1;
    const { error: updateError } = await supabase
      .from("ai_usage")
      .update({ request_count: nextCount, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (updateError) throw updateError;
    return { allowed: true, remaining: Math.max(DAILY_LIMIT - nextCount, 0) };
  }

  const { error: insertError } = await supabase
    .from("ai_usage")
    .insert({ user_id: userId, usage_date: usageDate, request_count: 1 });

  if (insertError) throw insertError;
  return { allowed: true, remaining: Math.max(DAILY_LIMIT - 1, 0) };
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Please sign in to use Aethel AI.", 401);
    }

    if (!process.env.GEMINI_API_KEY) {
      return jsonError("Aethel AI is not configured yet.", 503);
    }

    const limit = await checkDailyLimit(supabase, user.id);
    if (!limit.allowed) {
      return jsonError(`You have reached today's AI limit. Try again tomorrow.`, 429);
    }

    const body = await req.json();
    const messages = cleanMessages(body.messages);
    const documentContext = typeof body.documentContext === "string"
      ? body.documentContext.slice(0, MAX_DOCUMENT_CHARS)
      : "";

    if (messages.length === 0) {
      return jsonError("Send a message first.", 400);
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const userPrompt = documentContext
      ? `[Document context uploaded]\n\n${documentContext}\n\n---\n\nUser question: ${lastMessage.content}`
      : lastMessage.content;

    const result = await chat.sendMessageStream(userPrompt);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
        "X-Aethel-AI-Remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return jsonError("Aethel AI could not respond right now. Please try again shortly.", 500);
  }
}
