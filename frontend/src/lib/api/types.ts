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

export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
  years: number;
  experience_level: string;
  technologies_detail?: Technology[];
  order: number;
  is_core?: boolean;
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

export interface TimelineEvent {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  date: string;
  category: string;
  icon: string;
  link?: string;
  order: number;
  is_milestone?: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  slug: string;
  location?: string;
  start_date: string;
  end_date: string;
  grade?: string;
  achievements?: string[];
  relevant_courses?: string[];
}

export interface Certification {
  id: number;
  name: string;
  slug: string;
  issuer: string;
  credential_url?: string;
  issue_date: string;
  expiry_date?: string;
  badge?: string;
  related_skills_detail?: Skill[];
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
