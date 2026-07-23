import { z } from "zod";
import { isValidUzPhone } from "./phone";

/**
 * Lead submission contract (TZ flow F-02), shared verbatim by the client
 * form and the API route so validation can never drift. Error messages are
 * looked up from the issue paths by the consumer — the schema stays
 * locale-free.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .refine(isValidUzPhone, { message: "invalid_phone" }),
  courseType: z.enum(["category", "express"]),
  /** Category or express-course slug, depending on courseType. */
  courseSlug: z.string().trim().min(1).max(30).optional(),
  branchSlug: z.string().trim().min(1).max(50).optional(),
  consent: z.literal(true),
  locale: z.enum(["uz", "ru"]),
  sourcePage: z.string().trim().min(1).max(300),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Name of the honeypot field; real users never fill it (TZ doc 02 §3). */
export const HONEYPOT_FIELD = "company";
