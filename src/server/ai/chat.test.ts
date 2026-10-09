import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Orchestration tests.
 *
 * The HTTP transport to the model is mocked; everything below it is real —
 * the tool dispatcher, argument validation and the knowledge readers all run
 * against the actual content service. So these verify the grounding path
 * (that the model is handed real platform data and that the loop is bounded),
 * not the model's own wording. A live call is NOT covered here: see the
 * summary for what remains unverified without an API key.
 */

const create = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    messages = { create };
    static APIError = class extends Error {
      status = 500;
    };
    static APIConnectionTimeoutError = class extends Error {};
    static RateLimitError = class extends Error {};
  }
  return { default: MockAnthropic };
});

const ORIGINAL_KEY = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  create.mockReset();
  process.env.ANTHROPIC_API_KEY = "test-key";
});

function textReply(text: string) {
  return { content: [{ type: "text", text }], stop_reason: "end_turn" };
}

function toolReply(name: string, input: unknown, id = "tu_1") {
  return {
    content: [{ type: "tool_use", id, name, input }],
    stop_reason: "tool_use",
  };
}

describe("runChatTurn", () => {
  it("returns the model's text when no tools are needed", async () => {
    const { runChatTurn } = await import("./chat");
    create.mockResolvedValueOnce(textReply("Salom! Qanday yordam bera olaman?"));

    const result = await runChatTurn([{ role: "user", content: "Salom" }], "uz");
    expect(result).toEqual({
      ok: true,
      reply: "Salom! Qanday yordam bera olaman?",
      toolsUsed: [],
    });
  });

  it("executes a requested tool and feeds real platform data back", async () => {
    const { runChatTurn } = await import("./chat");
    create
      .mockResolvedValueOnce(toolReply("list_categories", {}))
      .mockResolvedValueOnce(textReply("B toifa narxi ..."));

    const result = await runChatTurn(
      [{ role: "user", content: "Narxlar qancha?" }],
      "uz",
    );
    expect(result.ok).toBe(true);
    expect(result.ok && result.toolsUsed).toEqual(["list_categories"]);

    // Second call must carry the tool_result containing real category data.
    const secondCall = create.mock.calls[1][0];
    const toolResultMessage = secondCall.messages.at(-1);
    expect(toolResultMessage.role).toBe("user");
    const payload = toolResultMessage.content[0];
    expect(payload.type).toBe("tool_result");
    expect(payload.tool_use_id).toBe("tu_1");
    // Real content, not a fixture: the catalogue starts at A and ends at D.
    expect(payload.content).toContain('"code":"A"');
    expect(payload.content).toContain('"code":"D"');
    expect(payload.content).toContain('"code":"E"');
  });

  it("passes an invalid tool argument back as a recoverable error", async () => {
    const { runChatTurn } = await import("./chat");
    create
      .mockResolvedValueOnce(toolReply("get_category", { slug: "../../etc/passwd" }))
      .mockResolvedValueOnce(textReply("Kechirasiz, bunday toifa yo'q."));

    const result = await runChatTurn([{ role: "user", content: "x" }], "uz");
    expect(result.ok).toBe(true);
    const payload = create.mock.calls[1][0].messages.at(-1).content[0];
    expect(payload.content).toContain("INVALID_ARGUMENTS");
  });

  it("withdraws tools on the final round so the loop cannot run forever", async () => {
    const { runChatTurn } = await import("./chat");
    // Always ask for another tool; the loop must still terminate.
    create.mockResolvedValue(toolReply("list_branches", {}));

    const result = await runChatTurn([{ role: "user", content: "x" }], "uz");
    expect(result.ok).toBe(false);

    const callCount = create.mock.calls.length;
    expect(callCount).toBeLessThanOrEqual(5);
    // The last request must carry no tools at all.
    expect(create.mock.calls[callCount - 1][0].tools).toBeUndefined();
  });

  it("fails closed when no API key is configured", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const { runChatTurn } = await import("./chat");
    const result = await runChatTurn([{ role: "user", content: "hi" }], "uz");
    expect(result).toEqual({ ok: false, error: "unconfigured" });
    expect(create).not.toHaveBeenCalled();
  });

  it("reports a refusal as an upstream failure rather than echoing it", async () => {
    const { runChatTurn } = await import("./chat");
    create.mockResolvedValueOnce({ content: [], stop_reason: "refusal" });
    const result = await runChatTurn([{ role: "user", content: "x" }], "uz");
    expect(result).toEqual({ ok: false, error: "upstream" });
  });

  it("sends the grounding system prompt on every request", async () => {
    const { runChatTurn } = await import("./chat");
    create.mockResolvedValueOnce(textReply("ok"));
    await runChatTurn([{ role: "user", content: "hi" }], "uz");
    expect(create.mock.calls[0][0].system).toContain("You are not the database");
  });
});

if (ORIGINAL_KEY === undefined) delete process.env.ANTHROPIC_API_KEY;
