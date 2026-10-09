import { z } from "zod";

/**
 * Chat request contract, shared by the client widget and the API route so
 * validation can never drift between them.
 */

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY_MESSAGES = 12;

export const chatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  /** Prior turns, oldest first. Trimmed server-side regardless. */
  history: z.array(chatTurnSchema).max(40).default([]),
  locale: z.enum(["uz", "ru"]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatSuccess {
  ok: true;
  reply: string;
}

export interface ChatFailure {
  ok: false;
  error: "validation" | "rate_limited" | "unavailable" | "upstream";
}

export type ChatResponse = ChatSuccess | ChatFailure;
