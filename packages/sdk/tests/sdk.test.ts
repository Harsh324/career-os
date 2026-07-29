import { describe, it, expect } from "vitest";
import { createCareerOS } from "../src/index.js";
import type { ContentGraph } from "@career-os/content-schema";

const mockGraph: ContentGraph = {
  meta: {
    name: "Jane Developer",
    title: "Staff Engineer",
    email: "jane@example.com",
  },
  experience: [
    {
      company: "Acme Corp",
      title: "Senior Engineer",
      startDate: "2022-01",
      endDate: "present",
      resumeInclude: true,
      featured: true,
      technologies: ["TypeScript", "React"],
      tags: ["Frontend"],
      body: "Leading frontend core team",
    },
    {
      company: "Beta Tech",
      title: "Software Engineer",
      startDate: "2020-01",
      endDate: "2021-12",
      resumeInclude: false,
      featured: false,
      technologies: ["Node.js"],
      tags: ["Backend"],
      body: "Backend microservices",
    },
  ],
  projects: [
    {
      title: "Awesome App",
      status: "active",
      featured: true,
      resumeInclude: true,
      technologies: ["TypeScript"],
      description: "An awesome app",
      tags: ["Open Source", "TypeScript"],
      slug: "awesome-app",
    },
    {
      title: "Side Script",
      status: "archived",
      featured: false,
      resumeInclude: false,
      technologies: ["Python"],
      description: "A Python script",
      tags: ["Python"],
      slug: "side-script",
    },
  ],
  education: [
    {
      institution: "Tech University",
      degree: "bachelor",
      field: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-06",
      featured: true,
      resumeInclude: true,
      tags: [],
    },
  ],
  skills: [
    {
      name: "TypeScript",
      category: "languages",
      level: "expert",
      featured: true,
      tags: [],
    },
    {
      name: "Docker",
      category: "devops",
      level: "advanced",
      featured: false,
      tags: [],
    },
  ],
  certifications: [],
  awards: [],
  blog: [
    {
      title: "First Post",
      description: "Hello World",
      publishedDate: "2026-01",
      draft: false,
      featured: true,
      tags: ["General"],
      slug: "first-post",
    },
  ],
  publications: [],
  timeline: [
    {
      title: "Joined Acme Corp",
      type: "career",
      date: "2022-01",
      featured: true,
      tags: ["Job"],
    },
  ],
  extensions: {},
};

describe("@career-os/sdk", () => {
  const career = createCareerOS(mockGraph);

  it("returns meta identity record", () => {
    const meta = career.meta();
    expect(meta.name).toBe("Jane Developer");
    expect(meta.email).toBe("jane@example.com");
  });

  it("filters projects by featured status and tags", () => {
    const all = career.projects();
    expect(all.length).toBe(2);

    const featured = career.projects({ featured: true });
    expect(featured.length).toBe(1);
    expect(featured[0]?.title).toBe("Awesome App");

    const tagged = career.projects({ tag: "typescript" });
    expect(tagged.length).toBe(1);
  });

  it("looks up project by slug", () => {
    const project = career.project("awesome-app");
    expect(project).toBeDefined();
    expect(project?.title).toBe("Awesome App");

    const missing = career.project("non-existent");
    expect(missing).toBeUndefined();
  });

  it("filters experience by resumeInclude", () => {
    const resumeExp = career.experience({ resumeInclude: true });
    expect(resumeExp.length).toBe(1);
    expect(resumeExp[0]?.company).toBe("Acme Corp");
  });

  it("groups skills by category", () => {
    const grouped = career.skillsByCategory();
    expect(grouped["languages"]?.length).toBe(1);
    expect(grouped["languages"]?.[0]?.name).toBe("TypeScript");
    expect(grouped["devops"]?.length).toBe(1);
  });

  it("returns Education, Blog, and Timeline data", () => {
    expect(career.education().length).toBe(1);
    expect(career.blog().length).toBe(1);
    expect(career.timeline().length).toBe(1);
  });
});
