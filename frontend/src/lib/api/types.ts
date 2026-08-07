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
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  lessons_learned?: string[];
  tech_stack_detail?: Technology[];
  status: string;
  repository?: string;
  demo?: string;
  screenshots?: string[];
  architecture_images?: string[];
  timeline?: string;
  featured: boolean;
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

export interface Experience {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  company_detail?: Company;
  employment_type: string;
  location?: string;
  start_date: string;
  end_date: string;
  current_position: boolean;
  featured: boolean;
  mission?: string;
  summary?: string;
  executive_overview?: string;
  highlights?: string[];
  responsibilities?: string[];
  focus_areas?: string[];
  tech_groups?: Record<string, string[]>;
  challenges?: TechnicalChallenge[];
  metrics?: Metric[];
  team?: string;
  ownership?: string;
  lessons_learned?: string[];
  architecture_diagram?: string;
  technologies_detail?: Technology[];
  related_projects_detail?: Project[];
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
  name: string;
  title: string;
  email: string;
  location: string;
  tagline: string;
  summary: string;
  avatar_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
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
