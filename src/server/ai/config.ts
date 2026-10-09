/**
 * AI provider configuration, read from the server environment only.
 *
 * The API key never reaches the client: this module is imported solely by
 * server code (`src/app/api/chat`), and nothing here is prefixed
 * NEXT_PUBLIC_. Every accessor fails closed — a missing key disables the
 * assistant rather than degrading to some unauthenticated call.
 */

/**
 * Default model. Overridable per deployment so the school can trade cost
 * against capability (e.g. claude-haiku-5-5 for high volume) without a
 * code change.
 */
const DEFAULT_MODEL = "claude-opus-5-5";

/** Answers are short chat turns; this ceiling is generous for that. */
export const MAX_OUTPUT_TOKENS = 1024;

/** Upper bound on a single visitor message (characters). */
export const MAX_MESSAGE_CHARS = 1000;

/** Conversation turns kept as context. Older turns are dropped. */
export const MAX_HISTORY_MESSAGES = 12;

/** Hard ceiling on tool round-trips per request, so a loop cannot run away. */
export const MAX_TOOL_ROUNDS = 4;

/** Whole-request timeout for the upstream model call. */
export const REQUEST_TIMEOUT_MS = 30_000;

export function getApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

/** True when the assistant has everything it needs to answer. */
export function isChatConfigured(): boolean {
  return Boolean(getApiKey());
}
