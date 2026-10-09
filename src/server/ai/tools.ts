import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { ContentLocale } from "@/content/types";
import {
  getBranchDetail,
  getCategoryDetail,
  getContactInfo,
  getEnrollmentInfo,
  listBranches,
  listCategories,
  listExpressCourses,
  getResultsSummary,
  searchFaq,
} from "./knowledge";

/**
 * The tool surface exposed to the model.
 *
 * Each entry pairs a declaration with a Zod-validated executor. The model
 * can only name a tool from this table and can only pass arguments that
 * survive validation, so there is no path from a chat message to arbitrary
 * data access. `strict: true` keeps the generated arguments schema-valid.
 */

const slugSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{1,60}$/, "slug must be lowercase letters, digits or hyphens"),
});

const querySchema = z.object({
  query: z.string().trim().min(1).max(200),
});

const emptySchema = z.object({});

interface ToolDef {
  declaration: Anthropic.Tool;
  run: (args: unknown, locale: ContentLocale) => Promise<unknown>;
}

function noArgs(
  name: string,
  description: string,
  run: (locale: ContentLocale) => Promise<unknown>,
): ToolDef {
  return {
    declaration: {
      name,
      description,
      strict: true,
      input_schema: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
    run: async (args, locale) => {
      emptySchema.parse(args ?? {});
      return run(locale);
    },
  };
}

export const TOOLS: Record<string, ToolDef> = {
  list_categories: noArgs(
    "list_categories",
    "List every driving category the school teaches, with its code, who it is for, duration, minimum age and current price (including any active promotion). Use this for questions about what courses exist or what they cost.",
    listCategories,
  ),

  get_category: {
    declaration: {
      name: "get_category",
      description:
        "Full detail for one driving category: price, duration, requirements, documents, curriculum, training vehicles, which branches teach it, and category-specific FAQ. Call list_categories first if you do not know the slug.",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Category slug, e.g. 'b', 'bc', 'ce', 'a', 'd', 'e'.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
    run: async (args, locale) => {
      const { slug } = slugSchema.parse(args);
      return getCategoryDetail(slug, locale);
    },
  },

  list_branches: noArgs(
    "list_branches",
    "List all branches with district, landmark address, phone numbers, working hours and a map link. Use for 'where are you', 'which branch is nearest', or any location question.",
    listBranches,
  ),

  get_branch: {
    declaration: {
      name: "get_branch",
      description:
        "Full detail for one branch, including which categories it teaches. Call list_branches first if you do not know the slug.",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "Branch slug, e.g. 'kosonsoy', 'buloq-avtodrom'.",
          },
        },
        required: ["slug"],
        additionalProperties: false,
      },
    },
    run: async (args, locale) => {
      const { slug } = slugSchema.parse(args);
      return getBranchDetail(slug, locale);
    },
  },

  list_express_courses: noArgs(
    "list_express_courses",
    "The express re-preparation courses for people who failed an exam: theory intensive and one-to-one practical sessions, with prices.",
    listExpressCourses,
  ),

  search_faq: {
    declaration: {
      name: "search_faq",
      description:
        "Search the school's published FAQ (enrolment, payment, process, exams, documents). Use when the visitor asks a general policy or procedure question.",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Keywords from the visitor's question.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
    run: async (args, locale) => {
      const { query } = querySchema.parse(args);
      return searchFaq(query, locale);
    },
  },

  get_contact_info: noArgs(
    "get_contact_info",
    "Official phone numbers, working hours, Telegram and Instagram links, and the licence number if published.",
    getContactInfo,
  ),

  get_results_summary: noArgs(
    "get_results_summary",
    "Published monthly exam results and aggregate graduate counts.",
    getResultsSummary,
  ),

  get_enrollment_info: noArgs(
    "get_enrollment_info",
    "How enrolment works end to end, the registration page link, required documents, and whether online payment or a student portal exist.",
    getEnrollmentInfo,
  ),
};

export const TOOL_DECLARATIONS: Anthropic.Tool[] = Object.values(TOOLS).map(
  (t) => t.declaration,
);

/**
 * Runs a tool the model requested. Unknown names and invalid arguments come
 * back as structured errors the model can recover from, never as thrown
 * exceptions that would abort the conversation.
 */
export async function runTool(
  name: string,
  args: unknown,
  locale: ContentLocale,
): Promise<unknown> {
  const tool = TOOLS[name];
  if (!tool) {
    return { error: "UNKNOWN_TOOL", available: Object.keys(TOOLS) };
  }
  try {
    return await tool.run(args, locale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "INVALID_ARGUMENTS", issues: error.issues.map((i) => i.message) };
    }
    // Log server-side; hand the model a safe, non-leaking failure marker.
    console.error(`[chat] tool ${name} failed`, error);
    return { error: "TOOL_FAILED" };
  }
}
