import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  CareerMetaSchema,
  CompanySchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  SkillSchema,
  CertificationSchema,
  AwardSchema,
  BlogPostSchema,
  PublicationSchema,
  TimelineEventSchema,
  type ContentGraph,
  type CareerMeta,
  type Company,
  type Experience,
  type Project,
  type Education,
  type Skill,
  type Certification,
  type Award,
  type BlogPost,
  type Publication,
  type TimelineEvent,
} from "@career-os/content-schema";

/**
 * Custom error thrown when a raw Markdown file fails Zod validation.
 * Includes explicit file path, field names, and expected constraints.
 */
export class ContentValidationError extends Error {
  constructor(
    public readonly filePath: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    const formatted = issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n");
    super(`Content validation failed in "${filePath}":\n${formatted}`);
    this.name = "ContentValidationError";
  }
}

/**
 * Helper to convert snake_case object keys to camelCase.
 * Allows content authors to write idiomatic YAML (e.g. resume_include, start_date)
 * while producing clean camelCase TypeScript types.
 */
function camelCaseKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      result[camelKey] = camelCaseKeys(value as Record<string, unknown>);
    } else {
      result[camelKey] = value;
    }
  }
  return result;
}

/**
 * Reads all .md files in a directory and extracts gray-matter front matter + body.
 */
function readMarkdownFiles(dirPath: string): Array<{
  filePath: string;
  filename: string;
  data: Record<string, unknown>;
  body: string;
}> {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results: Array<{
    filePath: string;
    filename: string;
    data: Record<string, unknown>;
    body: string;
  }> = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== ".gitkeep") {
      const fullPath = path.join(dirPath, entry.name);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const parsed = matter(fileContent);
      const slug = entry.name.replace(/\.md$/, "");
      const normalizedData = camelCaseKeys({ slug, ...parsed.data });

      // If Markdown body exists and front matter doesn't explicitly define body
      if (parsed.content && parsed.content.trim() && !normalizedData.body) {
        normalizedData.body = parsed.content.trim();
      }

      results.push({
        filePath: fullPath,
        filename: entry.name,
        data: normalizedData,
        body: parsed.content.trim(),
      });
    }
  }

  return results;
}

/**
 * Validates a single parsed item against a Zod schema.
 * Throws ContentValidationError on failure.
 */
function validateItem<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { issues: Array<{ path: (string | number)[]; message: string }> } } },
  data: unknown,
  filePath: string
): T {
  const result = schema.safeParse(data);
  if (!result.success && result.error) {
    const issues = result.error.issues.map((i) => ({
      path: i.path.join(".") || "root",
      message: i.message,
    }));
    throw new ContentValidationError(filePath, issues);
  }
  return result.data as T;
}

/**
 * Main parser entry point.
 * Reads raw Markdown content from contentDir and produces an immutable ContentGraph.
 */
export async function parseContent(contentDir: string): Promise<ContentGraph> {
  const rawRoot = path.resolve(contentDir);

  // 1. Meta identity parsing (meta.md)
  const metaPath = path.join(rawRoot, "meta.md");
  let meta: CareerMeta;
  if (fs.existsSync(metaPath)) {
    const parsed = matter(fs.readFileSync(metaPath, "utf-8"));
    const normalized = camelCaseKeys(parsed.data);
    meta = validateItem(CareerMetaSchema, normalized, metaPath);
  } else {
    // Provide a valid fallback stub if meta.md doesn't exist yet
    meta = {
      name: "Developer",
      title: "Software Engineer",
      email: "developer@example.com",
    };
  }

  // 2. Domain items parsing
  const companyFiles = readMarkdownFiles(path.join(rawRoot, "companies"));
  const companies: Company[] = companyFiles.map((f) =>
    validateItem<Company>(CompanySchema, f.data, f.filePath)
  );

  const experienceFiles = readMarkdownFiles(path.join(rawRoot, "experience"));
  const experience: Experience[] = experienceFiles
    .map((f) => validateItem<Experience>(ExperienceSchema, f.data, f.filePath))
    .sort((a, b) => (b.startDate > a.startDate ? 1 : -1));

  const projectFiles = readMarkdownFiles(path.join(rawRoot, "projects"));
  const projects: Project[] = projectFiles
    .map((f) => validateItem<Project>(ProjectSchema, f.data, f.filePath))
    .sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));

  const educationFiles = readMarkdownFiles(path.join(rawRoot, "education"));
  const education: Education[] = educationFiles
    .map((f) => validateItem<Education>(EducationSchema, f.data, f.filePath))
    .sort((a, b) => ((b.startDate ?? "") > (a.startDate ?? "") ? 1 : -1));

  const skillFiles = readMarkdownFiles(path.join(rawRoot, "skills"));
  const skills: Skill[] = skillFiles.map((f) =>
    validateItem<Skill>(SkillSchema, f.data, f.filePath)
  );

  const certFiles = readMarkdownFiles(path.join(rawRoot, "certifications"));
  const certifications: Certification[] = certFiles.map((f) =>
    validateItem<Certification>(CertificationSchema, f.data, f.filePath)
  );

  const awardFiles = readMarkdownFiles(path.join(rawRoot, "awards"));
  const awards: Award[] = awardFiles.map((f) =>
    validateItem<Award>(AwardSchema, f.data, f.filePath)
  );

  const blogFiles = readMarkdownFiles(path.join(rawRoot, "blog"));
  const blog: BlogPost[] = blogFiles
    .map((f) => validateItem<BlogPost>(BlogPostSchema, f.data, f.filePath))
    .sort((a, b) => (b.publishedDate > a.publishedDate ? 1 : -1));

  const pubFiles = readMarkdownFiles(path.join(rawRoot, "publications"));
  const publications: Publication[] = pubFiles.map((f) =>
    validateItem<Publication>(PublicationSchema, f.data, f.filePath)
  );

  const timelineFiles = readMarkdownFiles(path.join(rawRoot, "timeline"));
  const timeline: TimelineEvent[] = timelineFiles
    .map((f) => validateItem<TimelineEvent>(TimelineEventSchema, f.data, f.filePath))
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  return Object.freeze({
    meta,
    companies: Object.freeze(companies),
    experience: Object.freeze(experience),
    projects: Object.freeze(projects),
    education: Object.freeze(education),
    skills: Object.freeze(skills),
    certifications: Object.freeze(certifications),
    awards: Object.freeze(awards),
    blog: Object.freeze(blog),
    publications: Object.freeze(publications),
    timeline: Object.freeze(timeline),
    extensions: Object.freeze({}),
  }) as ContentGraph;
}
