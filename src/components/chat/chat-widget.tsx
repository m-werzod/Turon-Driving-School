"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, RotateCcw, Send, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SparkleIcon } from "./sparkle-icon";
import { MAX_MESSAGE_CHARS, type ChatResponse } from "@/lib/chat-schema";
import type { ContentLocale } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Floating AI assistant.
 *
 * Replaces the old floating call button in the bottom-right slot — see
 * docs/DECISIONS.md D-13. The launcher sits above the mobile sticky action
 * bar (which still carries the one-tap call) and respects safe-area insets,
 * so the two never collide and calling is never more than one tap away.
 *
 * Launcher shape is a rounded square (squircle), not a circle, with a
 * continuous gentle bounce + glow halo while closed — reuses the same
 * animate-jump bounce the old call button used, which already proved
 * attention-grabbing without being obnoxious. Both animations stop the
 * instant the panel opens and are neutralized under prefers-reduced-motion
 * (globals.css).
 *
 * All knowledge comes from POST /api/chat, which grounds every answer in the
 * platform's own content service; this component holds no business facts.
 */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "sending" | "error";

const TOOLTIP_DISMISSED_KEY = "turon-chat-tooltip-dismissed";
const TOOLTIP_DELAY_MS = 6000;

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale() as ContentLocale;

  const [open, setOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const lastUserMessage = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  // Welcome bubble: once per session, and never again after a dismissal.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TOOLTIP_DISMISSED_KEY) === "1";
    } catch {
      // Private mode — treat as not dismissed; it is only a nicety.
    }
    if (dismissed) return;
    const timer = setTimeout(() => setTooltipVisible(true), TOOLTIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismissTooltip = useCallback(() => {
    setTooltipVisible(false);
    try {
      sessionStorage.setItem(TOOLTIP_DISMISSED_KEY, "1");
    } catch {
      // Ignore — dismissal simply is not remembered.
    }
  }, []);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status, open]);

  // Escape closes the panel and returns focus to the launcher.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Abort any in-flight request if the widget unmounts mid-answer.
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!trimmed || status === "sending") return;

      lastUserMessage.current = trimmed;
      setErrorKey(null);
      setInput("");

      const userMessage: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      // Snapshot the history the server should see (excludes this message,
      // which the route appends itself).
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMessage]);
      setStatus("sending");

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history, locale }),
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as ChatResponse | null;

        if (response.ok && data?.ok) {
          setMessages((prev) => [
            ...prev,
            { id: `a-${Date.now()}`, role: "assistant", content: data.reply },
          ]);
          setStatus("idle");
          return;
        }

        if (response.status === 429) setErrorKey("rateLimited");
        else if (response.status === 503) setErrorKey("unavailable");
        else setErrorKey("generic");
        setStatus("error");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setErrorKey("generic");
        setStatus("error");
      }
    },
    [locale, messages, status],
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    void send(input);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter is a newline.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(input);
    }
  }

  function retry() {
    const previous = lastUserMessage.current;
    if (!previous) return;
    // Drop the failed exchange's trailing user bubble before re-sending.
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return last?.role === "user" ? prev.slice(0, -1) : prev;
    });
    setStatus("idle");
    setTimeout(() => void send(previous), 0);
  }

  const suggestionKeys = ["prices", "branches", "enroll", "categories", "express"] as const;

  return (
    <>
      {/* Launcher + welcome bubble */}
      <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3 lg:bottom-8 lg:right-8">
        {tooltipVisible && !open ? (
          <div className="animate-bubble-in relative max-w-[16rem] rounded-2xl rounded-br-md bg-white p-3.5 pr-9 text-sm text-ink-700 shadow-(--shadow-card-hover) ring-1 ring-ink-200/70">
            {t("tooltip")}
            <button
              type="button"
              onClick={dismissTooltip}
              aria-label={t("tooltipDismiss")}
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <button
          ref={launcherRef}
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            dismissTooltip();
          }}
          aria-label={t("launcherLabel")}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "group relative grid size-16 place-items-center rounded-[20px] bg-linear-to-br from-brand-500 via-brand-600 to-brand-900 text-white shadow-(--shadow-glow-brand) ring-4 ring-white/40 transition-transform duration-300 ease-premium hover:scale-110 hover:rotate-3 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600",
            // A gentle periodic bounce draws the eye while closed; stops the
            // instant the panel opens so it never competes with the chat UI.
            !open && "animate-jump",
          )}
        >
          <span
            aria-hidden="true"
            className="animate-glow-pulse absolute inset-0 -z-10 rounded-[26px] bg-brand-500/70 blur-md"
          />
          {open ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <SparkleIcon className="size-7 animate-float" style={{ animationDuration: "3.5s" }} />
          )}
          {/* Online dot */}
          {!open ? (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-white bg-emerald-500"
            />
          ) : null}
        </button>
      </div>

      {/* Chat panel */}
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={t("title")}
          className="animate-chat-in fixed inset-x-3 bottom-3 z-50 flex max-h-[min(34rem,calc(100dvh-5rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-(--shadow-card-hover) ring-1 ring-ink-200/70 sm:inset-x-auto sm:right-5 sm:w-[23rem] lg:bottom-28 lg:right-8"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-linear-to-r from-brand-900 to-brand-600 px-4 py-3.5 text-white">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-inset ring-white/25">
              <SparkleIcon className="size-5" />
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-brand-900 bg-emerald-400"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">{t("title")}</p>
              <p className="text-xs text-white/70">{t("online")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("minimize")}
              className="grid size-8 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setMessages([]);
                setStatus("idle");
                setErrorKey(null);
              }}
              aria-label={t("close")}
              className="grid size-8 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {/* Conversation */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overscroll-contain bg-ink-50/60 px-4 py-4"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-900 text-white shadow-(--shadow-glow-brand)">
                  <SparkleIcon className="size-6" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-ink-900">
                    {t("emptyTitle")}
                  </p>
                  <p className="mt-1 text-pretty text-xs text-ink-600">{t("emptyBody")}</p>
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={cn(
                      "animate-bubble-in flex",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap text-pretty rounded-2xl px-3.5 py-2.5 text-sm",
                        message.role === "user"
                          ? "rounded-br-md bg-brand-600 text-white"
                          : "rounded-bl-md bg-white text-ink-800 ring-1 ring-ink-200/70",
                      )}
                    >
                      {message.content}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {status === "sending" ? (
              <div className="mt-3 flex justify-start">
                <div
                  className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 ring-1 ring-ink-200/70"
                  aria-label={t("typing")}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="animate-float size-1.5 rounded-full bg-ink-400"
                      style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1.2s" }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {status === "error" && errorKey ? (
              <div
                role="alert"
                className="mt-3 flex flex-col gap-2 rounded-2xl bg-accent-50 p-3 text-xs text-accent-900 ring-1 ring-accent-500/20"
              >
                <span>{t(`errors.${errorKey}`)}</span>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-1.5 self-start rounded-pill bg-white px-3 py-1.5 font-semibold text-ink-800 ring-1 ring-ink-200 transition-colors hover:bg-ink-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  {t("retry")}
                </button>
              </div>
            ) : null}
          </div>

          {/* Suggestions — only before the first exchange, to avoid clutter */}
          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-1.5 border-t border-ink-100 bg-white px-4 py-3">
              {suggestionKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => void send(t(`suggestions.${key}`))}
                  className="rounded-pill bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-200/70 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                >
                  {t(`suggestions.${key}`)}
                </button>
              ))}
            </div>
          ) : null}

          {/* Composer */}
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t border-ink-100 bg-white px-3 py-3"
          >
            <label htmlFor="turon-chat-input" className="sr-only">
              {t("inputPlaceholder")}
            </label>
            <textarea
              id="turon-chat-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={MAX_MESSAGE_CHARS}
              placeholder={t("inputPlaceholder")}
              className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border-0 bg-ink-50 px-3.5 py-3 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 transition-shadow placeholder:text-ink-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "sending"}
              aria-label={t("send")}
              className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <Send className="size-4.5" aria-hidden="true" />
            </button>
          </form>

          <p className="bg-white px-4 pb-3 text-center text-[0.65rem] leading-tight text-ink-400">
            {t("disclaimer")}
          </p>
        </div>
      ) : null}
    </>
  );
}
