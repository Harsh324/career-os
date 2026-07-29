import type {
  ContentGraph,
  CareerMeta,
  Experience,
  Project,
  Education,
  Skill,
  SkillCategory,
  Certification,
  Award,
  BlogPost,
  Publication,
  TimelineEvent,
} from "@career-os/content-schema";

export interface ProjectFilter {
  featured?: boolean;
  tag?: string;
}

export interface ExperienceFilter {
  resumeInclude?: boolean;
  company?: string;
}

export interface BlogFilter {
  featured?: boolean;
  tag?: string;
}

/**
 * CareerOS SDK Client class wrapper.
 * Provides typed, immutable, read-only query access over a parsed ContentGraph.
 */
export class CareerOS {
  constructor(private readonly graph: Readonly<ContentGraph>) {}

  /** Returns the single identity record (meta.md). */
  meta(): Readonly<CareerMeta> {
    return this.graph.meta;
  }

  /** Returns all projects, optionally filtered by featured status or tag. */
  projects(filter?: ProjectFilter): ReadonlyArray<Project> {
    let items = this.graph.projects;
    if (filter?.featured !== undefined) {
      items = items.filter((p) => p.featured === filter.featured);
    }
    if (filter?.tag) {
      const tagLower = filter.tag.toLowerCase();
      items = items.filter((p) => p.tags?.some((t) => t.toLowerCase() === tagLower));
    }
    return items;
  }

  /** Returns a single project by slug, or undefined if not found. */
  project(slug: string): Readonly<Project> | undefined {
    return this.graph.projects.find((p) => p.slug === slug);
  }

  /** Returns work experience entries, optionally filtered by resumeInclude or company. */
  experience(filter?: ExperienceFilter): ReadonlyArray<Experience> {
    let items = this.graph.experience;
    if (filter?.resumeInclude !== undefined) {
      items = items.filter((e) => e.resumeInclude === filter.resumeInclude);
    }
    if (filter?.company) {
      const companyLower = filter.company.toLowerCase();
      items = items.filter((e) => e.company.toLowerCase() === companyLower);
    }
    return items;
  }

  /** Returns all education entries sorted chronologically. */
  education(): ReadonlyArray<Education> {
    return this.graph.education;
  }

  /** Returns technical and soft skills, optionally filtered by category. */
  skills(category?: SkillCategory): ReadonlyArray<Skill> {
    if (category) {
      return this.graph.skills.filter((s) => s.category === category);
    }
    return this.graph.skills;
  }

  /** Returns skills grouped by SkillCategory. */
  skillsByCategory(): Readonly<Record<string, ReadonlyArray<Skill>>> {
    const grouped: Record<string, Skill[]> = {};
    for (const skill of this.graph.skills) {
      const cat = skill.category;
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat]!.push(skill);
    }
    return grouped;
  }

  /** Returns all certifications. */
  certifications(): ReadonlyArray<Certification> {
    return this.graph.certifications;
  }

  /** Returns all awards and achievements. */
  awards(): ReadonlyArray<Award> {
    return this.graph.awards;
  }

  /** Returns blog posts, optionally filtered by featured status or tag. */
  blog(filter?: BlogFilter): ReadonlyArray<BlogPost> {
    let items = this.graph.blog;
    if (filter?.featured !== undefined) {
      items = items.filter((b) => b.featured === filter.featured);
    }
    if (filter?.tag) {
      const tagLower = filter.tag.toLowerCase();
      items = items.filter((b) => b.tags?.some((t) => t.toLowerCase() === tagLower));
    }
    return items;
  }

  /** Returns all academic and technical publications. */
  publications(): ReadonlyArray<Publication> {
    return this.graph.publications;
  }

  /** Returns all career timeline events. */
  timeline(): ReadonlyArray<TimelineEvent> {
    return this.graph.timeline;
  }

  /** Returns the full canonical ContentGraph. */
  getContentGraph(): Readonly<ContentGraph> {
    return this.graph;
  }
}

/**
 * Factory function to instantiate the CareerOS SDK from an in-memory ContentGraph.
 */
export function createCareerOS(graph: ContentGraph): CareerOS {
  return new CareerOS(graph);
}
