import { NextResponse } from "next/server";
import { HONEYPOT_FIELD, leadSchema } from "@/lib/lead-schema";
import { createLead, isLeadPipelineConfigured } from "@/server/leads";
import { checkRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

/**
 * Lead submission endpoint (TZ flow F-02).
 * Order of defenses: honeypot → rate limit → schema validation → delivery.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, {
      status: 400,
    });
  }

  // Bots that fill every field get a fake success and no processing.
  if (
    typeof payload === "object" &&
    payload !== null &&
    HONEYPOT_FIELD in payload &&
    Boolean((payload as Record<string, unknown>)[HONEYPOT_FIELD])
  ) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rate = checkRateLimit(`leads:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => String(issue.path[0]))),
    ];
    return NextResponse.json(
      { ok: false, error: "validation", fields },
      { status: 422 },
    );
  }

  if (!isLeadPipelineConfigured()) {
    // Refuse rather than silently drop the lead (docs/DECISIONS.md D-07).
    console.error(
      "[leads] no delivery channel configured (DATABASE_URL / TELEGRAM_*)",
    );
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503 },
    );
  }

  const result = await createLead(parsed.data);
  if (!result.accepted) {
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
