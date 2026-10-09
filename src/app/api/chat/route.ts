import { NextResponse } from "next/server";
import {
  MAX_HISTORY_MESSAGES,
  chatRequestSchema,
  type ChatResponse,
} from "@/lib/chat-schema";
import { isChatConfigured } from "@/server/ai/config";
import { runChatTurn, type ChatTurn } from "@/server/ai/chat";
import { checkRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";
// Replies depend on live content and the visitor's message — never cached.
export const dynamic = "force-dynamic";

/** Chat is chattier than the lead form, so it gets its own, looser budget. */
const CHAT_RATE_LIMIT = { windowMs: 5 * 60 * 1000, max: 20 };

/**
 * Public chat endpoint.
 *
 * Defence order: configuration gate -> per-IP rate limit -> schema
 * validation -> bounded model turn. The endpoint is deliberately
 * unauthenticated (it answers public questions only) and exposes no data
 * that is not already on the public site — the tool layer has no reader for
 * anything private.
 */
export async function POST(request: Request): Promise<NextResponse<ChatResponse>> {
  if (!isChatConfigured()) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rate = checkRateLimit(`chat:${ip}`, Date.now(), CHAT_RATE_LIMIT);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const { message, history, locale } = parsed.data;

  // Keep only the most recent turns: history is conversational context, not
  // a data source, and an unbounded transcript is both a cost and a
  // prompt-injection surface.
  const turns: ChatTurn[] = [
    ...history.slice(-MAX_HISTORY_MESSAGES),
    { role: "user", content: message },
  ];

  const outcome = await runChatTurn(turns, locale);

  if (!outcome.ok) {
    const status = outcome.error === "unconfigured" ? 503 : 502;
    return NextResponse.json(
      { ok: false, error: outcome.error === "unconfigured" ? "unavailable" : "upstream" },
      { status },
    );
  }

  return NextResponse.json({ ok: true, reply: outcome.reply });
}
