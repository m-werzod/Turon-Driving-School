import type { LeadInput } from "@/lib/lead-schema";
import { formatUzPhone, normalizeUzPhone } from "@/lib/phone";

const RETRY_DELAYS_MS = [0, 500, 1500];
const REQUEST_TIMEOUT_MS = 5000;

export function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );
}

/**
 * Sends the lead summary to the managers group (TZ flow F-02: instant,
 * zero-latency follow-up channel). Bounded retries; never throws — the
 * caller decides what a failed notification means for the response.
 */
export async function sendLeadNotification(lead: LeadInput): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const text = buildMessage(lead);

  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await sleep(delay);
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      );
      if (response.ok) return true;
      // 4xx will not succeed on retry (bad token/chat) — stop early.
      if (response.status >= 400 && response.status < 500) {
        console.error(
          `[telegram] sendMessage rejected with ${response.status}`,
        );
        return false;
      }
    } catch (error) {
      console.error("[telegram] sendMessage attempt failed", error);
    }
  }
  return false;
}

function buildMessage(lead: LeadInput): string {
  const phone = normalizeUzPhone(lead.phone);
  const lines = [
    "Yangi ariza — saytdan",
    `Ism: ${lead.name}`,
    `Telefon: ${phone ? formatUzPhone(phone) : lead.phone}`,
    `Yo'nalish: ${lead.courseType === "express" ? "Ekspress" : "Toifa"}${
      lead.courseSlug ? ` (${lead.courseSlug.toUpperCase()})` : ""
    }`,
  ];
  if (lead.branchSlug) lines.push(`Filial: ${lead.branchSlug}`);
  lines.push(`Til: ${lead.locale.toUpperCase()}`, `Sahifa: ${lead.sourcePage}`);
  return lines.join("\n");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
