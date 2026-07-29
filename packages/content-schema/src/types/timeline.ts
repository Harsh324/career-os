import { z } from "zod";

const YearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, "Date must be in YYYY-MM or YYYY-MM-DD format");

export const TimelineEventTypeSchema = z.enum([
  "career",
  "education",
  "project",
  "milestone",
  "publication",
  "travel",
  "personal",
]);

/**
 * A career timeline event — a point-in-time milestone or chapter.
 * Sourced from: content/raw/timeline/<slug>.md
 *
 * Timeline events are a curated narrative layer over the raw content entries.
 * They are not automatically derived from experience/ or projects/ — they are
 * intentionally authored (P2 — one owner: the timeline author).
 */
export const TimelineEventSchema = z.object({
  title: z.string().min(1, "title is required"),
  type: TimelineEventTypeSchema,
  date: YearMonthSchema,
  description: z.string().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  slug: z.string().optional(),
});

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type TimelineEventType = z.infer<typeof TimelineEventTypeSchema>;
