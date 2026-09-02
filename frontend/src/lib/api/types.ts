export interface Company {
  id: number;
  name: string;
  legal_name?: string;
  slug: string;
  logo?: string;
  website?: string;
  linkedin?: string;
  careers?: string;
  industry?: string;
  company_size?: string;
  headquarters?: string;
  location?: string;
  founded?: string;
  description?: string;
  short_description?: string;
}

export interface Technology {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  category?: string;
  description?: string;
}

export interface SkillRelatedExperience {
  id: number;
  title: string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
  current_position?: boolean;
  slug: string;
}

export interface SkillRelatedProject {
  id: number;
  title: string;
  slug: string;
  project_type: string;
  status: string;
}

export interface SkillCertificationDetail {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string;
  badge?: string;
  slug: string;
}

export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: string;
  proficiency: "expert" | "advanced" | "proficient" | "familiar" | "learning" | string;
  years: number;
  experience_level?: string;
  is_core: boolean;
  is_published: boolean;
  order: number;
  description?: string;
  evidence_context?: string;
  technologies?: number[];
  technologies_detail?: Technology[];
  related_experiences?: number[];
  related_experiences_detail?: SkillRelatedExperience[];
  related_projects?: number[];
  related_projects_detail?: SkillRelatedProject[];
  certifications_detail?: SkillCertificationDetail[];
  target_roles?: string[];
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectArchitectureFlowStep {
  step: number;
  title: string;
  detail?: string;
}

export interface ProjectKeyFeature {
  title: string;
  desc: string;
}

export interface ProjectHighlight {
  id?: string;
  text: string;
  is_public: boolean;
  target_roles?: string[];
  order?: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  project_type?: "application" | "infrastructure" | "platform" | "open_source" | "experiment" | string;
  status: "in_development" | "active" | "deployed" | "archived" | string;
  is_published?: boolean;
  featured: boolean;
  order?: number;
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  technical_outcome?: string;
  architecture?: string;
  timeline?: string;
  repository?: string;
  demo?: string;
  docs_url?: string;
  tech_stack?: number[];
  tech_stack_detail?: Technology[];
  architecture_flow?: ProjectArchitectureFlowStep[];
  key_features?: ProjectKeyFeature[];
  highlights?: ProjectHighlight[];
  target_roles?: string[];
  internal_notes?: string;
  screenshots?: string[];
  architecture_images?: string[];
  lessons_learned?: string[];
  roadmap?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TechnicalChallenge {
  problem: string;
  solution: string;
  impact?: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface ExperienceHighlight {
  id?: string;
  text: string;
  is_public: boolean;
  target_roles?: string[];
  order?: number;
}

export interface Experience {
  id?: number;
  title: string;
  subtitle?: string;
  slug: string;
  company?: number;
  company_detail?: Company;
  employment_type: string;
  location?: string;
  start_date: string;
  end_date: string;
  start_year_month?: string;
  current_position: boolean;
  is_published?: boolean;
  featured: boolean;
  mission?: string;
  summary?: string;
  executive_overview?: string;
  highlights?: Array<ExperienceHighlight | string>;
  responsibilities?: string[];
  focus_areas?: string[];
  tech_groups?: Record<string, string[]>;
  challenges?: TechnicalChallenge[];
  metrics?: Metric[];
  team?: string;
  ownership?: string;
  lessons_learned?: string[];
  architecture_diagram?: string;
  technologies?: number[];
  technologies_detail?: Technology[];
  related_projects?: number[];
  related_projects_detail?: Project[];
  target_roles?: string[];
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image?: string;
  status: string;
  published_at?: string;
  tags?: string[];
  series?: string;
  related_projects_detail?: Project[];
  related_experiences_detail?: Experience[];
}

export type TimelineSourceType =
  | "experience"
  | "education"
  | "certification"
  | "project"
  | "manual_milestone";

export interface TimelineEvent {
  id?: string | number;
  title: string;
  slug: string;
  source_type?: TimelineSourceType;
  source_id?: number | null;
  source_slug?: string;
  subtitle?: string;
  description?: string;
  date: string;
  date_sort?: string;
  category: string;
  icon: string;
  link?: string;
  order?: number;
  is_milestone?: boolean;
  is_published?: boolean;
  target_roles?: string[];
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type TimelineEntry = TimelineEvent;

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  slug: string;
  location?: string;
  start_date: string;
  end_date: string;
  currently_studying?: boolean;
  grade?: string;
  description?: string;
  achievements?: string[];
  relevant_courses?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  order?: number;
  target_roles?: string[];
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id?: number;
  name: string;
  slug: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date: string;
  expiry_date?: string;
  does_not_expire?: boolean;
  verification_status?: "verified" | "in_progress" | "expired" | string;
  category?: string;
  is_published?: boolean;
  is_featured?: boolean;
  order?: number;
  description?: string;
  badge?: string;
  badge_file?: string;
  related_skills?: number[];
  related_skills_detail?: Skill[];
  related_technologies?: number[];
  related_technologies_detail?: Technology[];
  related_experiences?: number[];
  related_experiences_detail?: SkillRelatedExperience[];
  related_projects?: number[];
  related_projects_detail?: SkillRelatedProject[];
  target_roles?: string[];
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id?: number;
  name: string;
  title: string;
  email: string;
  location: string;
  tagline: string;
  summary: string;
  engineering_focus: string[];
  open_to_work: boolean;
  target_roles?: string[];
  avatar_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface SEOMetadata {
  page_identifier: string;
  title: string;
  description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  canonical_url: string;
  robots: string;
  structured_data: Record<string, any>;
}

export type MediaAssetType =
  | "profile"
  | "project_image"
  | "project_logo"
  | "architecture_diagram"
  | "certification"
  | "education"
  | "company_logo"
  | "resume"
  | "document"
  | "social_preview"
  | "other";

export interface MediaAsset {
  id: number;
  title: string;
  slug: string;
  asset_type: MediaAssetType;
  file?: string | null;
  file_url: string;
  external_url?: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  is_image: boolean;
  is_document: boolean;
  alt_text: string;
  caption?: string;
  description?: string;
  tags?: string[];
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  related_projects?: number[];
  related_projects_detail?: Array<{
    id: number;
    title: string;
    slug: string;
    project_type?: string;
    status?: string;
  }>;
  related_experiences?: number[];
  related_experiences_detail?: Array<{
    id: number;
    title: string;
    slug: string;
    company_name?: string;
    start_date?: string;
    end_date?: string;
    current_position?: boolean;
  }>;
  related_certifications?: number[];
  related_certifications_detail?: Array<{
    id: number;
    name: string;
    slug: string;
    issuer?: string;
    issue_date?: string;
  }>;
  related_education?: number[];
  related_education_detail?: Array<{
    id: number;
    institution: string;
    degree: string;
    slug: string;
  }>;
  related_skills?: number[];
  related_skills_detail?: Array<{
    id: number;
    name: string;
    slug: string;
    category?: string;
  }>;
  target_roles?: string[];
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

