import path from "node:path";
import process from "node:process";
import { describe, it, expect } from "vitest";
import { parseContent, ContentValidationError } from "../src/index.js";

describe("@career-os/content-parser", () => {
  const contentDir = path.resolve(process.cwd().includes("packages") ? path.resolve(process.cwd(), "../../content/raw") : path.resolve(process.cwd(), "content/raw"));

  it("parses valid raw Markdown content into an immutable ContentGraph", async () => {
    const graph = await parseContent(contentDir);

    expect(graph).toBeDefined();
    expect(graph.meta).toBeDefined();
    expect(graph.meta.name).toBe("Harsh Vardhan");
    expect(graph.meta.email).toBe("harsh@example.com");

    expect(graph.experience.length).toBeGreaterThan(0);
    expect(graph.experience[0]?.company).toBe("DeepMind / Google");
    expect(graph.experience[0]?.resumeInclude).toBe(true);

    expect(graph.projects.length).toBeGreaterThan(0);
    expect(graph.projects[0]?.title).toBe("Career OS Platform");
    expect(graph.projects[0]?.featured).toBe(true);

    expect(graph.skills.length).toBeGreaterThan(0);
    expect(graph.skills[0]?.name).toBe("TypeScript");

    expect(graph.education.length).toBeGreaterThan(0);
    expect(graph.certifications.length).toBeGreaterThan(0);
    expect(graph.awards.length).toBeGreaterThan(0);
    expect(graph.blog.length).toBeGreaterThan(0);
    expect(graph.publications.length).toBeGreaterThan(0);
    expect(graph.timeline.length).toBeGreaterThan(0);

    // Verify immutability
    expect(Object.isFrozen(graph)).toBe(true);
    expect(Object.isFrozen(graph.experience)).toBe(true);
  });

  it("handles empty or missing optional directories gracefully", async () => {
    const emptyDir = path.resolve(process.cwd(), "docs");
    const graph = await parseContent(emptyDir);
    expect(graph).toBeDefined();
    expect(graph.experience).toEqual([]);
    expect(graph.projects).toEqual([]);
  });

  it("ContentValidationError formatted error structure test", () => {
    const error = new ContentValidationError("content/raw/test.md", [
      { path: "title", message: "title is required" },
    ]);
    expect(error.message).toContain('Content validation failed in "content/raw/test.md"');
    expect(error.message).toContain("- title: title is required");
  });
});
