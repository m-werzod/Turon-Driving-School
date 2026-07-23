"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Field, controlClasses } from "@/components/ui/field";
import { TelegramIcon } from "@/components/ui/brand-icons";
import { HONEYPOT_FIELD, leadSchema } from "@/lib/lead-schema";
import { normalizeUzPhone } from "@/lib/phone";
import type { ContentLocale } from "@/content/types";

export interface CourseOption {
  slug: string;
  label: string;
}

export interface LeadFormOptions {
  categories: CourseOption[];
  express: CourseOption[];
  branches: CourseOption[];
  telegramUrl: string;
}

export interface LeadPreselect {
  courseType: "category" | "express";
  courseSlug: string;
}

type FieldErrors = Partial<Record<"name" | "phone" | "consent", string>>;
type Status = "idle" | "submitting" | "success";

/**
 * Lead form (TZ flow F-01/F-02, template T-13 and inline placements).
 * Validates with the same Zod schema the API uses, formats the phone as the
 * user types, carries source page + locale for funnel analytics, and includes
 * a honeypot. Tags itself with data-lead-form so the sticky action bar hides
 * while the form is on screen (§5.3).
 */
export function LeadForm({
  options,
  preselect,
  compact = false,
}: {
  options: LeadFormOptions;
  preselect?: LeadPreselect;
  compact?: boolean;
}) {
  const t = useTranslations("leadForm");
  const locale = useLocale() as ContentLocale;
  const pathname = usePathname();
  const baseId = useId();

  const [course, setCourse] = useState(
    preselect ? `${preselect.courseType}:${preselect.courseSlug}` : "",
  );
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const [courseType, courseSlug] = String(formData.get("course") || ":").split(":");

    const candidate = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      courseType: courseType === "express" ? "express" : "category",
      courseSlug: courseSlug || undefined,
      branchSlug: String(formData.get("branch") ?? "") || undefined,
      consent: formData.get("consent") === "on",
      locale,
      sourcePage: pathname,
    };

    const parsed = leadSchema.safeParse(candidate);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "name") nextErrors.name = t("errors.name");
        if (key === "phone") nextErrors.phone = t("errors.phone");
        if (key === "consent") nextErrors.consent = t("errors.consent");
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          phone: normalizeUzPhone(parsed.data.phone),
          [HONEYPOT_FIELD]: formData.get(HONEYPOT_FIELD) ?? "",
        }),
      });

      if (response.status === 201) {
        setStatus("success");
        form.reset();
        return;
      }
      if (response.status === 429) {
        setFormError(t("errors.rateLimited"));
      } else {
        setFormError(t("errors.generic"));
      }
      setStatus("idle");
    } catch {
      setFormError(t("errors.generic"));
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        data-lead-form
        className="flex flex-col items-center gap-4 rounded-card bg-success-50 p-8 text-center ring-1 ring-success-600/20"
        role="status"
      >
        <CheckCircle2 className="size-12 text-success-600" aria-hidden="true" />
        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-bold text-ink-900">{t("success.title")}</p>
          <p className="text-pretty text-ink-600">{t("success.body")}</p>
        </div>
        <a
          href={options.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-control bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50"
        >
          <TelegramIcon className="size-5" />
          {t("success.telegram")}
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      data-lead-form
      className="flex flex-col gap-4"
    >
      <Field id={`${baseId}-name`} label={t("nameLabel")} error={errors.name}>
        {(props) => (
          <input
            {...props}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={`${controlClasses} h-12`}
            required
          />
        )}
      </Field>

      <Field id={`${baseId}-phone`} label={t("phoneLabel")} error={errors.phone}>
        {(props) => (
          <input
            {...props}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
            className={`${controlClasses} h-12`}
            required
          />
        )}
      </Field>

      <div className={compact ? "" : "grid gap-4 sm:grid-cols-2"}>
        <Field id={`${baseId}-course`} label={t("courseLabel")}>
          {(props) => (
            <select
              {...props}
              name="course"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              className={`${controlClasses} h-12`}
            >
              <option value="">{t("coursePlaceholder")}</option>
              <optgroup label={t("courseCategoryGroup")}>
                {options.categories.map((option) => (
                  <option key={option.slug} value={`category:${option.slug}`}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t("courseExpressGroup")}>
                {options.express.map((option) => (
                  <option key={option.slug} value={`express:${option.slug}`}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
        </Field>

        <Field id={`${baseId}-branch`} label={t("branchLabel")}>
          {(props) => (
            <select {...props} name="branch" className={`${controlClasses} h-12`} defaultValue="">
              <option value="">{t("branchNone")}</option>
              {options.branches.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      {/* Honeypot: visually hidden, off the tab order; bots that fill it are dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${baseId}-company`}>Company</label>
        <input
          id={`${baseId}-company`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input
            name="consent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 rounded border-ink-300 text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          />
          <span>
            {t("consentPrefix")}{" "}
            <Link href="/privacy" className="font-semibold text-brand-700 underline underline-offset-2">
              {t("consentLink")}
            </Link>
            {t("consentSuffix") ? ` ${t("consentSuffix")}` : ""}
          </span>
        </label>
        {errors.consent ? (
          <p role="alert" className="text-sm text-danger-600">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="rounded-control bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            {t("submitting")}
          </>
        ) : (
          <>
            <Send className="size-5" aria-hidden="true" />
            {t("submit")}
          </>
        )}
      </Button>
    </form>
  );
}

/**
 * Progressive phone formatting toward +998 90 123 45 67 as the user types.
 * Purely presentational — the schema re-normalizes on submit.
 */
function formatPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  const parts = ["+998"];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  return parts.join(" ").trim();
}
