import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentLocale } from "@/content/types";
import {
  MAX_OUTPUT_TOKENS,
  MAX_TOOL_ROUNDS,
  REQUEST_TIMEOUT_MS,
  getApiKey,
  getModel,
} from "./config";
import { buildSystemPrompt } from "./prompt";
import { TOOL_DECLARATIONS, runTool } from "./tools";

/** One turn of the visible conversation. */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type ChatOutcome =
  | { ok: true; reply: string; toolsUsed: string[] }
  | { ok: false; error: "unconfigured" | "upstream" | "timeout" | "empty" };

let cachedClient: Anthropic | null = null;

function getClient(apiKey: string): Anthropic {
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey, timeout: REQUEST_TIMEOUT_MS, maxRetries: 1 });
  }
  return cachedClient;
}

/**
 * Runs one assistant turn: ask the model, execute any tools it requests
 * against the platform's own content service, feed the results back, and
 * return the final text.
 *
 * The loop is bounded by MAX_TOOL_ROUNDS so a misbehaving turn cannot spin.
 * Tool failures are returned to the model as data (never thrown), so it can
 * tell the visitor something useful instead of the request collapsing.
 */
export async function runChatTurn(
  history: ChatTurn[],
  locale: ContentLocale,
): Promise<ChatOutcome> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[chat] ANTHROPIC_API_KEY is not set — assistant disabled");
    return { ok: false, error: "unconfigured" };
  }

  const client = getClient(apiKey);
  const messages: Anthropic.MessageParam[] = history.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));

  const toolsUsed: string[] = [];

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
      const lastRound = round === MAX_TOOL_ROUNDS;

      const response = await client.messages.create({
        model: getModel(),
        max_tokens: MAX_OUTPUT_TOKENS,
        system: buildSystemPrompt(),
        messages,
        // On the final round, withdraw the tools so the model must answer
        // with what it already has rather than requesting more.
        ...(lastRound ? {} : { tools: TOOL_DECLARATIONS }),
      });

      if (response.stop_reason === "refusal") {
        return { ok: false, error: "upstream" };
      }

      const toolUses = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
      );

      if (toolUses.length === 0 || lastRound) {
        const reply = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === "text")
          .map((block) => block.text)
          .join("\n")
          .trim();
        return reply
          ? { ok: true, reply, toolsUsed }
          : { ok: false, error: "empty" };
      }

      messages.push({ role: "assistant", content: response.content });

      // Parallel tool calls must come back as tool_result blocks in a single
      // user message, in the same order they were requested.
      const results = await Promise.all(
        toolUses.map(async (toolUse) => {
          toolsUsed.push(toolUse.name);
          const result = await runTool(toolUse.name, toolUse.input, locale);
          return {
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: JSON.stringify(result),
          };
        }),
      );

      messages.push({ role: "user", content: results });
    }

    return { ok: false, error: "empty" };
  } catch (error) {
    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      console.error("[chat] upstream timeout");
      return { ok: false, error: "timeout" };
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.error("[chat] upstream rate limited");
      return { ok: false, error: "upstream" };
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`[chat] upstream API error ${error.status}`);
      return { ok: false, error: "upstream" };
    }
    console.error("[chat] unexpected failure", error);
    return { ok: false, error: "upstream" };
  }
}
