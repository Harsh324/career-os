from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.certifications.models import Certification
from apps.companies.models import Company
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.seo.models import SEOMetadata
from apps.site_settings.models import SiteSettings
from apps.skills.models import Skill
from apps.technologies.models import Technology
from apps.timeline.models import TimelineEvent


class Command(BaseCommand):
    help = "Idempotent initial database seeder for Career OS."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting idempotent database seeding process..."))

        # 0. Admin Superuser Creation
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            import os

            admin_password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
            if admin_password:
                User.objects.create_superuser("admin", "admin@career-os.dev", admin_password)
                self.stdout.write(
                    self.style.SUCCESS(
                        "Created admin superuser (username: admin, password from environment)"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        "Skipped admin superuser creation: DJANGO_SUPERUSER_PASSWORD environment variable not set."
                    )
                )

        # 1. Site Settings (Forced update)
        settings_obj, created = SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                "name": "Harsh Tripathi",
                "title": "Backend & Cloud Engineer",
                "email": "tripathiharsh324@gmail.com",
                "location": "Tokyo, Japan",
                "tagline": "Backend & Cloud Software Engineer building scalable systems using Python, Django, Celery & AWS.",
                "summary": (
                    "Backend & Cloud Software Engineer specializing in Python, Django, Celery asynchronous pipelines, "
                    "Docker containerization, and AWS infrastructure. Currently building AI-driven data extraction platforms "
                    "and scalable microservices at SMS DataTech in Tokyo."
                ),
                "engineering_focus": [
                    "Backend APIs",
                    "Distributed Systems",
                    "AWS Cloud",
                    "AI Data Platforms",
                ],
                "open_to_work": True,
                "target_roles": [
                    "Backend Engineering",
                    "Cloud Architecture",
                ],
                "avatar_url": "https://github.com/Harsh324.png",
                "github_url": "https://github.com/Harsh324",
                "linkedin_url": "https://linkedin.com/in/harsh324",
                "twitter_url": "https://x.com/harsh324",
                "resume_url": "https://career-os.dev/resume.pdf",
            },
        )
        if created:
            self.stdout.write("Created initial Site Settings.")
        else:
            self.stdout.write("Site Settings already exists; skipping default overwrite.")

        # 2. Technologies
        tech_data = [
            {
                "name": "Python",
                "slug": "python",
                "category": "Languages",
                "website": "https://www.python.org",
            },
            {
                "name": "JavaScript",
                "slug": "javascript",
                "category": "Languages",
                "website": "https://developer.mozilla.org",
            },
            {"name": "SQL", "slug": "sql", "category": "Languages", "website": ""},
            {
                "name": "Django",
                "slug": "django",
                "category": "Backend",
                "website": "https://www.djangoproject.com",
            },
            {
                "name": "Django REST Framework",
                "slug": "drf",
                "category": "Backend",
                "website": "https://www.django-rest-framework.org",
            },
            {
                "name": "Celery",
                "slug": "celery",
                "category": "Backend",
                "website": "https://docs.celeryq.dev",
            },
            {
                "name": "AWS",
                "slug": "aws",
                "category": "Cloud & Infra",
                "website": "https://aws.amazon.com",
            },
            {
                "name": "AWS ECS / Fargate",
                "slug": "ecs-fargate",
                "category": "Cloud & Infra",
                "website": "",
            },
            {
                "name": "CloudFormation",
                "slug": "cloudformation",
                "category": "Cloud & Infra",
                "website": "",
            },
            {
                "name": "Docker",
                "slug": "docker",
                "category": "DevOps",
                "website": "https://www.docker.com",
            },
            {
                "name": "GitHub Actions",
                "slug": "github-actions",
                "category": "DevOps",
                "website": "https://github.com/features/actions",
            },
            {"name": "Git", "slug": "git", "category": "DevOps", "website": "https://git-scm.com"},
            {
                "name": "MySQL",
                "slug": "mysql",
                "category": "Databases",
                "website": "https://www.mysql.com",
            },
            {
                "name": "MongoDB",
                "slug": "mongodb",
                "category": "Databases",
                "website": "https://www.mongodb.com",
            },
            {
                "name": "PostgreSQL",
                "slug": "postgresql",
                "category": "Databases",
                "website": "https://www.postgresql.org",
            },
            {
                "name": "Redis",
                "slug": "redis",
                "category": "Databases",
                "website": "https://redis.io",
            },
            {
                "name": "TypeScript",
                "slug": "typescript",
                "category": "Languages",
                "website": "https://www.typescriptlang.org",
            },
            {
                "name": "Next.js",
                "slug": "nextjs",
                "category": "Frameworks",
                "website": "https://nextjs.org",
            },
            {
                "name": "Traefik",
                "slug": "traefik",
                "category": "Cloud & Infra",
                "website": "https://traefik.io",
            },
            {
                "name": "Cloudflare",
                "slug": "cloudflare",
                "category": "Cloud & Infra",
                "website": "https://www.cloudflare.com",
            },
            {
                "name": "Ubuntu Linux",
                "slug": "ubuntu-linux",
                "category": "Cloud & Infra",
                "website": "https://ubuntu.com",
            },
        ]
        tech_map = {}
        for item in tech_data:
            tech, _ = Technology.objects.get_or_create(slug=item["slug"], defaults=item)
            tech_map[item["slug"]] = tech
        self.stdout.write(f"Processed {len(tech_map)} Technologies.")

        # 3. Company Record (SMS DataTech)
        company_obj, _ = Company.objects.update_or_create(
            slug="sms-datatech",
            defaults={
                "name": "SMS DataTech",
                "legal_name": "SMS DataTech Corporation",
                "logo": "/images/companies/sms-datatech-icon.png",
                "website": "https://www.sms-datatech.co.jp/",
                "careers": "https://www.sms-datatech.co.jp/careers",
                "linkedin": "https://www.linkedin.com/company/sms-datatech",
                "industry": "Enterprise Software & Cloud Services",
                "company_size": "500-1000 employees",
                "headquarters": "Tokyo, Japan",
                "location": "Tokyo, Japan",
                "founded": "2001",
                "description": "SMS DataTech is an independent IT solutions company in Japan specializing in system development, cybersecurity, and AI/cloud engineering.",
                "short_description": "Enterprise cloud infrastructure, cybersecurity, and AI engineering provider.",
            },
        )
        self.stdout.write("Processed SMS DataTech Company record.")

        # 4. Core Projects
        p1, _ = Project.objects.update_or_create(
            slug="career-os",
            defaults={
                "title": "Career OS",
                "project_type": "platform",
                "status": "active",
                "is_published": True,
                "featured": True,
                "order": 3,
                "timeline": "2026 – Present",
                "summary": "Backend-driven engineering portfolio and career management platform built with Django REST Framework, PostgreSQL, Next.js, and Docker.",
                "description": "Architected as a backend-driven engineering portfolio and career management platform with Django REST Framework as the centralized source of truth for all career records.",
                "problem": "Static portfolio generators lack dynamic content editing, centralized backend APIs, and structured career evidence management.",
                "solution": "Built a centralized Django REST backend that acts as the authoritative source of truth for career records, with a Next.js App Router frontend dynamically consuming structured API endpoints.",
                "technical_outcome": "Centralized content schema management across portfolio UI, PDF generators, and REST APIs with zero data duplication.",
                "repository": "https://github.com/Harsh324/career-os",
                "demo": "https://career-os.dev",
                "docs_url": "",
                "architecture_flow": [
                    {"step": 1, "title": "Next.js 15 App Router Frontend", "detail": "REST API Request via React Query"},
                    {"step": 2, "title": "Django REST Framework (DRF) Central API", "detail": "Single Source of Truth & Masking"},
                    {"step": 3, "title": "PostgreSQL Storage (Experiences, Projects, Skills)", "detail": "Authoritative Career Data Layer"}
                ],
                "key_features": [
                    {"title": "Centralized Source of Truth", "desc": "PostgreSQL and Django REST Framework backend serving as the canonical source for career records."},
                    {"title": "Dynamic App Router Presentation", "desc": "Next.js 15 App Router frontend dynamically rendering portfolio pages from structured API data."},
                    {"title": "Idempotent Seeding & Infrastructure", "desc": "Dockerized local and production environments with automated database migrations and health checks."},
                    {"title": "Structured Evidence Bank", "desc": "Granular achievement evidence bank with public/private controls ready for Resume Studio."}
                ],
                "highlights": [
                    {
                        "id": "proj-cos-1",
                        "text": "Architected centralized Django REST Framework API and PostgreSQL schema establishing single source of truth for portfolio records.",
                        "is_public": True,
                        "target_roles": ["Backend Engineering", "Full-Stack Development"],
                        "order": 0
                    },
                    {
                        "id": "proj-cos-2",
                        "text": "Built Next.js 15 App Router frontend with React Query caching, dark mode support, and dynamic server-side rendering.",
                        "is_public": True,
                        "target_roles": ["Frontend Engineering", "Full-Stack Development"],
                        "order": 1
                    }
                ],
                "target_roles": ["Backend Engineering", "Full-Stack Development"],
                "internal_notes": "Foundation platform for all career management and future Resume Studio LaTeX generation.",
            },
        )
        p1.tech_stack.set([
            tech_map["python"],
            tech_map["django"],
            tech_map["postgresql"],
            tech_map["docker"],
            tech_map["nextjs"],
            tech_map["typescript"],
        ])

        p2, _ = Project.objects.update_or_create(
            slug="fintrack-ai",
            defaults={
                "title": "FinTrack AI",
                "project_type": "application",
                "status": "in_development",
                "is_published": True,
                "featured": True,
                "order": 1,
                "timeline": "2026 – Present",
                "summary": "Financial transaction management backend platform for transaction tracking, automated rule categorization, and shared expense processing.",
                "description": "Financial backend engine built with Python, Django, PostgreSQL, and Redis query caching. Features include transaction tracking, automated categorization rules, and shared expense management, with OCR-based automated bill splitting currently in active development.",
                "problem": "Manual transaction tracking and shared expense management across groups is prone to categorization errors and calculation discrepancies.",
                "solution": "Built a centralized financial management backend leveraging automated categorization rule engines, indexed PostgreSQL schemas, and Redis caching.",
                "technical_outcome": "Enabled automated transaction categorization and reliable expense processing via standardized PostgreSQL schemas.",
                "repository": "https://github.com/Harsh324/fintrack-ai",
                "demo": "",
                "docs_url": "",
                "architecture_flow": [
                    {"step": 1, "title": "Financial Transaction Stream Input", "detail": "Ingestion & Validation Pipeline"},
                    {"step": 2, "title": "Automated Categorization Engine", "detail": "Rule Processing & Pattern Matching"},
                    {"step": 3, "title": "PostgreSQL Database & Redis Query Cache", "detail": "Persistent Storage & Transient Query Caching"}
                ],
                "key_features": [
                    {"title": "Automated Categorization Engine", "desc": "Rule-based transaction processing engine for financial transaction streams."},
                    {"title": "PostgreSQL Query Optimization", "desc": "Optimized transaction schema with indexing for fast category aggregations."},
                    {"title": "Redis Transient Caching", "desc": "Redis caching layer for session and transient state management."},
                    {"title": "Structured RESTful APIs", "desc": "Django REST Framework endpoints with structured JSON schemas."}
                ],
                "highlights": [
                    {
                        "id": "proj-ft-1",
                        "text": "Designed high-performance PostgreSQL transaction schema with multi-column indexing for fast monthly category aggregations.",
                        "is_public": True,
                        "target_roles": ["Backend Engineering", "Database Optimization"],
                        "order": 0
                    },
                    {
                        "id": "proj-ft-2",
                        "text": "Implemented Redis query caching layer reducing repeated database read latency for dashboard summaries.",
                        "is_public": True,
                        "target_roles": ["Backend Engineering", "Distributed Systems"],
                        "order": 1
                    }
                ],
                "target_roles": ["Backend Engineering", "Database Optimization"],
                "internal_notes": "OCR bill splitting is currently in development. Keep live demo empty until deployed.",
            },
        )
        p2.tech_stack.set([
            tech_map["python"],
            tech_map["django"],
            tech_map["postgresql"],
            tech_map["redis"],
        ])

        p3, _ = Project.objects.update_or_create(
            slug="constellation",
            defaults={
                "title": "Constellation",
                "project_type": "infrastructure",
                "status": "active",
                "is_published": True,
                "featured": True,
                "order": 2,
                "timeline": "2026 – Present (v0.9.2 Baseline)",
                "summary": "Self-hosted infrastructure platform for securely running and managing containerized services on a personal homelab.",
                "description": "Built on Ubuntu Linux with Cloudflare Tunnels, Traefik reverse proxy, shared PostgreSQL/Redis storage, automated encrypted daily S3 backups, and 3-tier health monitoring.",
                "problem": "Exposing self-hosted services directly to the internet creates firewall attack surfaces, while unmanaged containers risk data loss without automated backups and health monitoring.",
                "solution": "Built an automated infrastructure setup with zero open inbound ports using Cloudflare Tunnels, Traefik v3 dynamic routing, isolated internal container networks, and encrypted offsite backups.",
                "technical_outcome": "Zero inbound attack surface, 100% automated encrypted daily backups with 14-day retention, and real-time Telegram alerts for service outages.",
                "repository": "https://github.com/Harsh324/constellation",
                "demo": "https://portal.constellationhq.dev/",
                "docs_url": "",
                "architecture_flow": [
                    {"step": 1, "title": "Zero-Trust Ingress (Cloudflare Tunnel & Tailscale)", "detail": "Secure Gateway Routing"},
                    {"step": 2, "title": "Traefik v3 Reverse Proxy & Dynamic Service Discovery", "detail": "Automatic Docker Label Discovery & SSL"},
                    {"step": 3, "title": "Backend Services, Data Tier (PostgreSQL / Redis) & Monitoring", "detail": "Isolated Container Network"}
                ],
                "key_features": [
                    {"title": "Standardized Service Templates", "desc": "Modular Docker Compose configs with isolated internal networks, standardized environment variables, and health checks for every service."},
                    {"title": "Zero-Trust Ingress & Routing", "desc": "Secure outbound Cloudflare Tunnels with automatic SSL and Traefik v3 reverse proxy for dynamic service discovery."},
                    {"title": "3-Tier Observability Platform", "desc": "External Cloudflare Workers for instant Telegram outage alerts, Uptime Kuma for internal health checks, and Beszel for server metrics."},
                    {"title": "Persistent Data & Backups", "desc": "Shared PostgreSQL 17, Redis, and MinIO storage with automated daily age-encrypted S3 backups and 14-day retention."}
                ],
                "highlights": [
                    {
                        "id": "proj-const-1",
                        "text": "Architected zero-trust homelab infrastructure utilizing Cloudflare Tunnels and Traefik v3 with zero open inbound firewall ports.",
                        "is_public": True,
                        "target_roles": ["DevOps", "Platform Engineering", "Cloud Architecture"],
                        "order": 0
                    },
                    {
                        "id": "proj-const-2",
                        "text": "Built automated daily backup pipeline with age encryption and S3 offsite replication with 14-day retention policy.",
                        "is_public": True,
                        "target_roles": ["DevOps", "Site Reliability Engineering"],
                        "order": 1
                    }
                ],
                "target_roles": ["DevOps", "Platform Engineering", "Cloud Architecture"],
                "internal_notes": "Maintained as primary personal homelab infrastructure baseline.",
            },
        )
        p3.tech_stack.set([
            tech_map["docker"],
            tech_map["traefik"],
            tech_map["postgresql"],
            tech_map["cloudflare"],
            tech_map["ubuntu-linux"],
        ])

        self.stdout.write("Processed Projects (Career OS, FinTrack AI, Constellation).")

        # 5. Experience Records
        exp1, _ = Experience.objects.update_or_create(
            slug="software-engineer-sms",
            defaults={
                "title": "Software Engineer (Backend and Cloud)",
                "company": company_obj,
                "subtitle": "Software Engineer (Backend and Cloud)",
                "location": "Tokyo, Japan",
                "employment_type": "full-time",
                "start_date": "Oct 2024",
                "end_date": "Present",
                "current_position": True,
                "featured": True,
                "mission": "Designed and developed an AI-driven scraping platform using LLM-based modules for automated data extraction workflows across dynamic websites.",
                "summary": "Building scalable asynchronous pipelines using Celery and queue-based task processing. Containerizing services using Docker and deploying to AWS ECS/Fargate via CloudFormation while managing AWS infrastructure and handling 1000+ daily internal requests.",
                "executive_overview": "Leading backend architectural redesign, database optimization, Celery async pipelines, Docker containerization, and AWS ECS/Fargate cloud deployments.",
                "highlights": [
                    "Designed and developed an AI-driven data extraction platform using LLM-based modules",
                    "Built scalable asynchronous processing pipelines using Celery and queue-based workflows",
                    "Achieved an API performance improvement of 20–30% through backend and database optimization",
                    "Led backend system redesign including API structure, database schema, and backend architecture",
                    "Containerized services using Docker and automated deployments to AWS ECS/Fargate via CloudFormation",
                    "Handled 1000+ daily internal requests across backend services",
                    "Managed AWS resources including EC2, ECS, S3, CloudWatch, Auto Scaling, and Load Balancing",
                    "Owned task execution, feature delivery, and provided technical mentorship",
                ],
                "challenges": [
                    {
                        "problem": "Dynamic websites required reliable asynchronous extraction without blocking synchronous API requests.",
                        "solution": "Implemented queue-based Celery processing with distributed worker pools.",
                        "impact": "Enabled complex extraction workflows to execute asynchronously while improving API responsiveness.",
                    },
                    {
                        "problem": "Manual cloud service deployments caused environment mismatch delays.",
                        "solution": "Containerized services using Docker and automated AWS ECS/Fargate deployments via CloudFormation.",
                        "impact": "Achieved predictable deployments, auto scaling, and reliable execution under high internal request volume.",
                    },
                ],
                "metrics": [
                    {"label": "API Performance Improvement", "value": "20–30%"},
                    {"label": "Daily Internal Requests", "value": "1000+"},
                    {"label": "Cloud Deployment", "value": "AWS ECS/Fargate"},
                ],
                "team": "SMS DataTech Backend & Cloud Engineering Team",
                "ownership": "Ownership of AI scraping platform backend, Celery async task queue architecture, and AWS CloudFormation templates.",
                "lessons_learned": [
                    "Queue-based asynchronous task processing with Celery decouples long-running LLM extraction from synchronous API response cycles.",
                    "Standardized Docker containerization ensures identical execution environments across local development and AWS ECS/Fargate.",
                ],
            },
        )
        exp1.technologies.add(
            tech_map["python"],
            tech_map["django"],
            tech_map["celery"],
            tech_map["aws"],
            tech_map["docker"],
            tech_map["ecs-fargate"],
            tech_map["cloudformation"],
            tech_map["sql"],
        )
        exp1.related_projects.add(p1, p2)

        exp2, _ = Experience.objects.update_or_create(
            slug="software-engineer-intern-sms",
            defaults={
                "title": "Software Engineer Intern",
                "company": company_obj,
                "subtitle": "Software Engineer Intern",
                "location": "Tokyo, Japan",
                "employment_type": "internship",
                "start_date": "Jul 2023",
                "end_date": "May 2024",
                "current_position": False,
                "featured": True,
                "mission": "Developed backend services using Django REST Framework for the POGO internal dashboard, resulting in a transition to a full-time role.",
                "summary": "Designed and implemented REST APIs and MySQL schemas to improve internal workflow visibility. Successfully transitioned from Intern to full-time Software Engineer (Backend and Cloud) upon graduation.",
                "executive_overview": "Designed REST API endpoints and MySQL database schemas for internal project tools.",
                "highlights": [
                    "Developed backend services using Django REST Framework for the POGO internal dashboard",
                    "Designed and implemented REST APIs and relational database schemas using MySQL",
                    "Built multiple backend features from scratch, improving internal workflow visibility",
                    "Collaborated with cross-functional teams to deliver functional internal tools",
                ],
                "challenges": [],
                "metrics": [],
                "team": "SMS DataTech Engineering Team",
                "ownership": "Development of REST API endpoints and database models for internal project visibility.",
                "lessons_learned": [
                    "Designing clear REST API contracts and normalized relational schemas early simplifies frontend integration and long-term maintenance."
                ],
            },
        )
        exp2.technologies.add(
            tech_map["python"],
            tech_map["django"],
            tech_map["drf"],
            tech_map["mysql"],
            tech_map["sql"],
            tech_map["git"],
        )
        exp2.related_projects.add(p2)

        self.stdout.write(
            "Processed Experience records (SMS DataTech Oct 2024–Present & Jul 2023–May 2024)."
        )

        # 6. Skills (Canonical Capability & Evidence Matrix)
        skills_data = [
            # 1. Backend Engineering
            {
                "name": "Python",
                "slug": "python-skill",
                "category": "Backend Engineering",
                "proficiency": "expert",
                "years": 3.0,
                "order": 1,
                "is_core": True,
                "is_published": True,
                "description": "Primary backend language utilized for microservices, asynchronous task queues, data processing, and cloud automation.",
                "evidence_context": "Core backend engine for SMS DataTech enterprise platforms, Career OS REST API, and FinTrack AI analytics.",
                "tech_slugs": ["python"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["career-os", "fintrack-ai"],
                "target_roles": ["Backend Engineering", "Platform Engineering", "Full-Stack Development"],
                "internal_notes": "Primary language for technical interviews, systems design, and DRF backend architecture.",
            },
            {
                "name": "Django",
                "slug": "django-skill",
                "category": "Backend Engineering",
                "proficiency": "expert",
                "years": 2.5,
                "order": 2,
                "is_core": True,
                "is_published": True,
                "description": "Full-stack Python web framework for robust, secure, and maintainable backend architectures with ORM optimization.",
                "evidence_context": "Production monoliths and service APIs at SMS DataTech; backend engine for Career OS.",
                "tech_slugs": ["django"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering", "Full-Stack Development"],
                "internal_notes": "High proficiency in Django ORM indexing, signal decoupling, middleware, and transaction management.",
            },
            {
                "name": "Django REST Framework",
                "slug": "drf-skill",
                "category": "Backend Engineering",
                "proficiency": "expert",
                "years": 2.5,
                "order": 3,
                "is_core": True,
                "is_published": True,
                "description": "Enterprise toolkit for building strictly typed, secure RESTful web APIs, serializers, custom permissions, and throttling.",
                "evidence_context": "Architected canonical REST API layer for Career OS and high-throughput endpoints at SMS DataTech.",
                "tech_slugs": ["django", "python"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Deep expertise with ViewSets, dynamic serializer masking, and permission classes.",
            },
            {
                "name": "Celery",
                "slug": "celery-skill",
                "category": "Backend Engineering",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 4,
                "is_core": True,
                "is_published": True,
                "description": "Distributed asynchronous task queue and scheduling system paired with Redis brokers for non-blocking workflows.",
                "evidence_context": "Implemented async email delivery, report aggregation, and scheduled background tasks at SMS DataTech.",
                "tech_slugs": ["redis", "python"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["fintrack-ai"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Experience managing worker concurrency, task retry backoff, and dead-letter queues.",
            },
            {
                "name": "REST API Design",
                "slug": "rest-api-design-skill",
                "category": "Backend Engineering",
                "proficiency": "expert",
                "years": 3.0,
                "order": 5,
                "is_core": False,
                "is_published": True,
                "description": "RESTful resource modeling, idempotency, versioning strategies, error contracts, and API documentation.",
                "evidence_context": "Standardized internal and external API specifications across multi-service deployments.",
                "tech_slugs": ["django", "fastapi"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "fintrack-ai"],
                "target_roles": ["Backend Engineering", "Systems Architecture"],
                "internal_notes": "Focus on semantic HTTP status codes, pagination, and response normalization.",
            },
            {
                "name": "API Performance Optimization",
                "slug": "api-performance-skill",
                "category": "Backend Engineering",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 6,
                "is_core": False,
                "is_published": True,
                "description": "Profiling database query bottlenecks, N+1 query elimination (select_related / prefetch_related), and caching.",
                "evidence_context": "Reduced API response latencies across core database-heavy endpoints at SMS DataTech.",
                "tech_slugs": ["django", "postgresql", "redis"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Demonstrated performance gains through query analysis and Redis caching layers.",
            },

            # 2. Cloud & Infrastructure
            {
                "name": "AWS",
                "slug": "aws-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "expert",
                "years": 2.5,
                "order": 1,
                "is_core": True,
                "is_published": True,
                "description": "Comprehensive Amazon Web Services cloud architecture, identity management, compute, storage, and networking.",
                "evidence_context": "AWS Certified Solutions Architect & Developer; deployed production workloads across ECS, S3, RDS, and CloudWatch.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation"],
                "target_roles": ["Cloud Architecture", "Platform Engineering", "Backend Engineering"],
                "internal_notes": "Strong grasp of AWS Well-Architected Framework and security best practices.",
            },
            {
                "name": "ECS / Fargate",
                "slug": "ecs-fargate-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 2,
                "is_core": True,
                "is_published": True,
                "description": "Serverless container management, task definitions, service autoscaling, and ALB integration on AWS.",
                "evidence_context": "Containerized backend deployment orchestration and zero-downtime rolling updates.",
                "tech_slugs": ["aws", "docker"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": [],
                "target_roles": ["Cloud Architecture", "Platform Engineering", "DevOps"],
                "internal_notes": "Experience with task role IAM policies, target group health checks, and log drivers.",
            },
            {
                "name": "AWS Cloud Architecture",
                "slug": "aws-cloud-arch-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "advanced",
                "years": 2.5,
                "order": 3,
                "is_core": False,
                "is_published": True,
                "description": "Architecting resilient, secure, high-availability multi-AZ environments with VPC peering, NAT, and security groups.",
                "evidence_context": "Validated by AWS Solutions Architect Associate & Developer Associate certifications.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation"],
                "target_roles": ["Cloud Architecture", "Platform Engineering"],
                "internal_notes": "Well-versed in trade-offs between serverless vs container-based cloud architectures.",
            },
            {
                "name": "EC2",
                "slug": "ec2-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "advanced",
                "years": 2.5,
                "order": 4,
                "is_core": False,
                "is_published": True,
                "description": "Elastic Compute Cloud instance provisioning, EBS storage configuration, AMI lifecycle, and autoscaling groups.",
                "evidence_context": "Managed compute instances for self-hosted tooling and staging servers.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation"],
                "target_roles": ["Cloud Architecture", "DevOps"],
                "internal_notes": "Proficient in security group rules, SSH bastion access, and instance metadata.",
            },
            {
                "name": "S3",
                "slug": "s3-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "expert",
                "years": 2.5,
                "order": 5,
                "is_core": False,
                "is_published": True,
                "description": "Scalable cloud object storage, lifecycle retention policies, CORS configuration, and pre-signed URL generation.",
                "evidence_context": "Offsite encrypted backup replication for Constellation homelab and media asset pipelines.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation", "career-os"],
                "target_roles": ["Cloud Architecture", "Backend Engineering"],
                "internal_notes": "Implemented bucket versioning, KMS encryption, and IAM least-privilege bucket policies.",
            },
            {
                "name": "CloudFormation",
                "slug": "cloudformation-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "proficient",
                "years": 1.5,
                "order": 6,
                "is_core": False,
                "is_published": True,
                "description": "Infrastructure as Code (IaC) templating for repeatable and version-controlled AWS resource provisioning.",
                "evidence_context": "Defined declarative infrastructure stacks for container compute and database services.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": [],
                "target_roles": ["Cloud Architecture", "DevOps"],
                "internal_notes": "Experience writing nested templates and parameter overrides.",
            },
            {
                "name": "CloudWatch",
                "slug": "cloudwatch-skill",
                "category": "Cloud & Infrastructure",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 7,
                "is_core": False,
                "is_published": True,
                "description": "Cloud telemetry, structured application logging, metric filters, alarm triggers, and dashboard monitoring.",
                "evidence_context": "Implemented proactive error alerting and service health monitoring at SMS DataTech.",
                "tech_slugs": ["aws"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": [],
                "target_roles": ["Cloud Architecture", "Site Reliability Engineering"],
                "internal_notes": "Configured SNS alarm notifications and metric alarms for CPU/Memory utilization thresholds.",
            },

            # 3. Architecture & Distributed Systems
            {
                "name": "Distributed Systems",
                "slug": "distributed-systems-skill",
                "category": "Architecture & Distributed Systems",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 1,
                "is_core": False,
                "is_published": True,
                "description": "Fundamental principles of distributed consensus, message brokers, eventual consistency, and fault tolerance.",
                "evidence_context": "Decoupled monolithic services into asynchronous worker pipelines and microservices at SMS DataTech.",
                "tech_slugs": ["redis", "docker"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation", "career-os"],
                "target_roles": ["Backend Engineering", "Platform Engineering", "Systems Architecture"],
                "internal_notes": "Solid understanding of CAP theorem trade-offs and network partition mitigation.",
            },
            {
                "name": "Asynchronous Architecture",
                "slug": "async-architecture-skill",
                "category": "Architecture & Distributed Systems",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 2,
                "is_core": False,
                "is_published": True,
                "description": "Event-driven background execution, worker queues, batch job scheduling, and non-blocking I/O.",
                "evidence_context": "Architected async task queues using Celery and Redis to isolate long-running operations from web workers.",
                "tech_slugs": ["redis", "python"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["fintrack-ai"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Implemented idempotent job handlers and exponential backoff retry policies.",
            },
            {
                "name": "Caching & Performance",
                "slug": "caching-performance-skill",
                "category": "Architecture & Distributed Systems",
                "proficiency": "advanced",
                "years": 2.5,
                "order": 3,
                "is_core": False,
                "is_published": True,
                "description": "Multi-tier caching strategies (in-memory, Redis, HTTP caching headers, CDN reverse proxies).",
                "evidence_context": "Integrated Redis caching and Next.js ISR/SWR caching across Career OS and production web endpoints.",
                "tech_slugs": ["redis"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Deep understanding of cache invalidation strategies and cache-aside patterns.",
            },
            {
                "name": "System & API Design",
                "slug": "system-api-design-skill",
                "category": "Architecture & Distributed Systems",
                "proficiency": "advanced",
                "years": 2.5,
                "order": 4,
                "is_core": False,
                "is_published": True,
                "description": "Clean domain modeling, bounded contexts, database schema normalization, and modular service boundaries.",
                "evidence_context": "Designed end-to-end data schemas and API contracts for Career OS and enterprise platforms.",
                "tech_slugs": ["django", "postgresql"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "constellation"],
                "target_roles": ["Systems Architecture", "Backend Engineering"],
                "internal_notes": "Applies domain-driven design and strict data validation at API boundaries.",
            },

            # 4. Databases & Caching
            {
                "name": "PostgreSQL",
                "slug": "postgresql-skill",
                "category": "Databases & Caching",
                "proficiency": "expert",
                "years": 3.0,
                "order": 1,
                "is_core": True,
                "is_published": True,
                "description": "Relational schema design, JSONB indexing, ACID transaction management, foreign keys, and complex aggregations.",
                "evidence_context": "Canonical source of truth for Career OS and primary production database at SMS DataTech.",
                "tech_slugs": ["postgresql"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["career-os", "fintrack-ai"],
                "target_roles": ["Backend Engineering", "Database Administration", "Platform Engineering"],
                "internal_notes": "Expertise in EXPLAIN ANALYZE, B-tree/GIN indexes, and migration safety.",
            },
            {
                "name": "MySQL",
                "slug": "mysql-skill",
                "category": "Databases & Caching",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 2,
                "is_core": False,
                "is_published": True,
                "description": "Relational data modeling, InnoDB storage engine tuning, query indexing, and replication management.",
                "evidence_context": "Maintained and queried legacy enterprise databases during internship and internal tool integrations.",
                "tech_slugs": ["mysql"],
                "exp_slugs": ["software-engineer-intern-sms"],
                "proj_slugs": [],
                "target_roles": ["Backend Engineering"],
                "internal_notes": "Familiar with InnoDB deadlock diagnostics and index cardinality tuning.",
            },
            {
                "name": "Redis",
                "slug": "redis-skill",
                "category": "Databases & Caching",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 3,
                "is_core": False,
                "is_published": True,
                "description": "In-memory data store for caching, session stores, pub/sub messaging, and distributed locks.",
                "evidence_context": "Utilized as message broker for Celery queues and low-latency key-value caching.",
                "tech_slugs": ["redis"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "fintrack-ai"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Used for rate limiting, TTL-based ephemeral cache keys, and queue backends.",
            },
            {
                "name": "Database Optimization",
                "slug": "database-optimization-skill",
                "category": "Databases & Caching",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 4,
                "is_core": False,
                "is_published": True,
                "description": "Query plan analysis, composite indexes, connection pooling (PgBouncer), and query refactoring.",
                "evidence_context": "Identified and resolved slow queries in production reporting queries at SMS DataTech.",
                "tech_slugs": ["postgresql", "django"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering", "Platform Engineering"],
                "internal_notes": "Eliminated slow table scans by adding targeted partial and composite indexes.",
            },
            {
                "name": "Query Performance / Indexing",
                "slug": "query-performance-skill",
                "category": "Databases & Caching",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 5,
                "is_core": False,
                "is_published": True,
                "description": "Index design (B-Tree, GIN, Hash), query normalization, and reducing disk I/O overhead.",
                "evidence_context": "Designed indexing strategy across relational tables for fast full-text and foreign key filtering.",
                "tech_slugs": ["postgresql"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Backend Engineering"],
                "internal_notes": "Solid understanding of index overhead on write throughput.",
            },

            # 5. AI & Data
            {
                "name": "LLM Integrations",
                "slug": "llm-skill",
                "category": "AI & Data",
                "proficiency": "proficient",
                "years": 1.5,
                "order": 1,
                "is_core": False,
                "is_published": True,
                "description": "Integrating LLM APIs (OpenAI, Anthropic Claude, Google Gemini) for structured information extraction and summarization.",
                "evidence_context": "Implemented portfolio copilot AI assistant and receipt categorization workflows.",
                "tech_slugs": ["python"],
                "exp_slugs": [],
                "proj_slugs": ["fintrack-ai", "career-os"],
                "target_roles": ["AI Engineering", "Backend Engineering"],
                "internal_notes": "Focused on structured JSON outputs, prompt constraints, and rate limiting.",
            },
            {
                "name": "AI/Data Extraction",
                "slug": "ai-extraction-skill",
                "category": "AI & Data",
                "proficiency": "proficient",
                "years": 1.5,
                "order": 2,
                "is_core": False,
                "is_published": True,
                "description": "OCR pipeline integration, document parsing, and heuristic schema normalization.",
                "evidence_context": "Built document and receipt parsing pipelines for automated expense categorization in FinTrack AI.",
                "tech_slugs": ["python"],
                "exp_slugs": [],
                "proj_slugs": ["fintrack-ai"],
                "target_roles": ["Data Engineering", "Backend Engineering"],
                "internal_notes": "Experience handling messy input text, fuzzy matching, and validation fallbacks.",
            },
            {
                "name": "Data Processing Pipelines",
                "slug": "data-pipelines-skill",
                "category": "AI & Data",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 3,
                "is_core": False,
                "is_published": True,
                "description": "ETL batch processing, data cleaning, validation pipelines, and automated reporting.",
                "evidence_context": "Engineered automated data ingestion and aggregation scripts at SMS DataTech.",
                "tech_slugs": ["python", "postgresql"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["fintrack-ai"],
                "target_roles": ["Data Engineering", "Backend Engineering"],
                "internal_notes": "Emphasizes idempotent processing, transaction safety, and error logging.",
            },

            # 6. DevOps & CI/CD
            {
                "name": "Docker",
                "slug": "docker-skill",
                "category": "DevOps & CI/CD",
                "proficiency": "expert",
                "years": 3.0,
                "order": 1,
                "is_core": True,
                "is_published": True,
                "description": "Multi-stage container builds, image size optimization, compose orchestration, and container networking.",
                "evidence_context": "Standardized local and production Docker environments across all services and Constellation homelab.",
                "tech_slugs": ["docker"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["constellation", "career-os", "fintrack-ai"],
                "target_roles": ["DevOps", "Platform Engineering", "Cloud Architecture"],
                "internal_notes": "Deep knowledge of layer caching, non-root users, and healthcheck directives.",
            },
            {
                "name": "Git & GitHub",
                "slug": "git-skill",
                "category": "DevOps & CI/CD",
                "proficiency": "expert",
                "years": 4.0,
                "order": 2,
                "is_core": False,
                "is_published": True,
                "description": "Branching workflows, Conventional Commits, interactive rebasing, pull request governance, and release tags.",
                "evidence_context": "Maintains strict Git hygiene and branch management across all personal and professional repositories.",
                "tech_slugs": ["git", "github"],
                "exp_slugs": ["software-engineer-sms", "software-engineer-intern-sms"],
                "proj_slugs": ["career-os", "constellation", "fintrack-ai"],
                "target_roles": ["Software Engineering", "DevOps"],
                "internal_notes": "Adheres strictly to Trunk-Based or short-lived feature branch workflows.",
            },
            {
                "name": "GitHub Actions",
                "slug": "github-actions-skill",
                "category": "DevOps & CI/CD",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 3,
                "is_core": False,
                "is_published": True,
                "description": "Automated workflow pipelines for linting, type-checking, automated unit testing, and Docker image builds.",
                "evidence_context": "Constructed automated CI pipelines running test matrices and quality gates on every PR.",
                "tech_slugs": ["github", "docker"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "constellation"],
                "target_roles": ["DevOps", "Platform Engineering"],
                "internal_notes": "Implemented artifact caching and secure secret handling.",
            },
            {
                "name": "CI/CD Pipelines",
                "slug": "cicd-skill",
                "category": "DevOps & CI/CD",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 4,
                "is_core": False,
                "is_published": True,
                "description": "Continuous integration and delivery patterns, automated deployments, rollback safety, and environment parity.",
                "evidence_context": "Automated staging and production deployment pipelines for web services.",
                "tech_slugs": ["docker", "github"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "constellation"],
                "target_roles": ["DevOps", "Platform Engineering"],
                "internal_notes": "Focused on test-gated deployments and zero-downtime container swaps.",
            },
            {
                "name": "Containerization",
                "slug": "containerization-skill",
                "category": "DevOps & CI/CD",
                "proficiency": "expert",
                "years": 3.0,
                "order": 5,
                "is_core": False,
                "is_published": True,
                "description": "Container lifecycle management, isolation, volume persistence, bridge networking, and secret injection.",
                "evidence_context": "Self-hosted over 10 isolated containerized workloads on Debian homelab (Constellation).",
                "tech_slugs": ["docker"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["constellation", "career-os"],
                "target_roles": ["DevOps", "Platform Engineering", "Cloud Architecture"],
                "internal_notes": "Expert in Traefik reverse proxy container routing and Docker daemon security.",
            },

            # 7. Supporting Technologies
            {
                "name": "TypeScript",
                "slug": "typescript-skill",
                "category": "Supporting Technologies",
                "proficiency": "advanced",
                "years": 2.5,
                "order": 1,
                "is_core": False,
                "is_published": True,
                "description": "Strongly typed frontend application development, API interface definitions, and React state management.",
                "evidence_context": "TypeScript control plane and portfolio frontend for Career OS with strict type contracts.",
                "tech_slugs": ["typescript"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os", "fintrack-ai"],
                "target_roles": ["Full-Stack Development", "Frontend Engineering"],
                "internal_notes": "Strict compiler configuration with zero any types in production components.",
            },
            {
                "name": "Next.js",
                "slug": "nextjs-skill",
                "category": "Supporting Technologies",
                "proficiency": "advanced",
                "years": 2.0,
                "order": 2,
                "is_core": False,
                "is_published": True,
                "description": "React framework with App Router, Server Components, client state hooks, and optimized static asset generation.",
                "evidence_context": "Built modern, responsive, fast frontend application for Career OS consuming DRF backend.",
                "tech_slugs": ["nextjs", "typescript"],
                "exp_slugs": ["software-engineer-sms"],
                "proj_slugs": ["career-os"],
                "target_roles": ["Full-Stack Development", "Frontend Engineering"],
                "internal_notes": "App Router, route handlers, Server and Client Components architecture.",
            },
        ]

        for s in skills_data:
            tech_slugs = s.pop("tech_slugs", [])
            exp_slugs = s.pop("exp_slugs", [])
            proj_slugs = s.pop("proj_slugs", [])

            skill_obj, _ = Skill.objects.update_or_create(slug=s["slug"], defaults=s)

            # Relational M2M links
            if tech_slugs:
                for ts in tech_slugs:
                    if ts in tech_map:
                        skill_obj.technologies.add(tech_map[ts])
            if exp_slugs:
                for es in exp_slugs:
                    exp_item = Experience.objects.filter(slug=es).first()
                    if exp_item:
                        skill_obj.related_experiences.add(exp_item)
            if proj_slugs:
                for ps in proj_slugs:
                    proj_item = Project.objects.filter(slug=ps).first()
                    if proj_item:
                        skill_obj.related_projects.add(proj_item)

        self.stdout.write("Processed 28 Skills with canonical proficiency and relational evidence.")

        # 7. Education (IIIT Nagpur Dec 2020 – Jun 2024)
        Education.objects.update_or_create(
            slug="iiit-nagpur",
            defaults={
                "institution": "Indian Institute of Information Technology (IIIT Nagpur)",
                "degree": "B.Tech in Computer Science and Engineering",
                "field_of_study": "Computer Science and Engineering",
                "location": "Nagpur, India",
                "start_date": "Dec 2020",
                "end_date": "Jun 2024",
                "grade": "First Class",
                "achievements": [
                    "Graduated with B.Tech in Computer Science and Engineering.",
                    "Studied Core Computer Science, Distributed Systems, Relational Databases, and System Design.",
                ],
                "relevant_courses": [
                    "Data Structures & Algorithms",
                    "Operating Systems",
                    "Database Management Systems",
                    "Computer Networks",
                    "System Design",
                ],
            },
        )
        self.stdout.write("Processed Education (IIIT Nagpur).")

        # 8. Certifications
        Certification.objects.get_or_create(
            slug="aws-solutions-architect",
            defaults={
                "name": "AWS Certified Solutions Architect – Associate",
                "issuer": "Amazon Web Services",
                "credential_url": "https://cp.certmetrics.com/amazon/en/public/verify/credential/9c0287d7cbf04661a24c19a061a02e76",
                "issue_date": "2025-08-19",
                "expiry_date": "2028-08-19",
            },
        )
        Certification.objects.get_or_create(
            slug="aws-cloudops-engineer",
            defaults={
                "name": "AWS Certified CloudOps Engineer – Associate",
                "issuer": "Amazon Web Services",
                "credential_url": "https://cp.certmetrics.com/amazon/en/public/verify/credential/6a4511dc5dc84e709d958785ad74ba96",
                "issue_date": "2026-04-01",
                "expiry_date": "2029-04-01",
            },
        )
        self.stdout.write("Processed Certifications.")

        # 9. Timeline Events
        timeline_events = [
            {
                "title": "B.Tech Computer Science Enrollment",
                "slug": "1-iiit-nagpur-enrollment",
                "subtitle": "IIIT Nagpur (Nagpur, India)",
                "description": "Enrolled in B.Tech in Computer Science and Engineering at Indian Institute of Information Technology, Nagpur.",
                "date": "Dec 2020",
                "category": "Education",
                "icon": "GraduationCap",
                "order": 1,
            },
            {
                "title": "Software Engineer Intern",
                "slug": "2-sms-internship",
                "subtitle": "SMS DataTech (Tokyo, Japan)",
                "description": "Developed backend services using Django REST Framework and MySQL for the POGO internal dashboard.",
                "date": "Jul 2023 – May 2024",
                "category": "Career",
                "icon": "Briefcase",
                "order": 2,
            },
            {
                "title": "B.Tech Computer Science Graduation",
                "slug": "3-iiit-nagpur-graduation",
                "subtitle": "IIIT Nagpur",
                "description": "Graduated with B.Tech in Computer Science and Engineering from IIIT Nagpur.",
                "date": "Jun 2024",
                "category": "Education",
                "icon": "GraduationCap",
                "order": 3,
            },
            {
                "title": "Backend & Cloud Engineer",
                "slug": "4-sms-fulltime",
                "subtitle": "SMS DataTech (Tokyo, Japan)",
                "description": "Building AI-driven scraping platforms, Celery async pipelines, Docker containers, and AWS ECS/Fargate cloud infrastructure.",
                "date": "Oct 2024 – Present",
                "category": "Career",
                "icon": "Briefcase",
                "order": 4,
            },
            {
                "title": "AWS Certified Solutions Architect – Associate",
                "slug": "5-aws-solutions-architect",
                "subtitle": "Amazon Web Services",
                "description": "Earned official AWS Certified Solutions Architect – Associate credential.",
                "date": "Aug 2025",
                "category": "Certification",
                "icon": "Award",
                "link": "https://cp.certmetrics.com/amazon/en/public/verify/credential/9c0287d7cbf04661a24c19a061a02e76",
                "order": 5,
            },
            {
                "title": "AWS Certified CloudOps Engineer – Associate",
                "slug": "6-aws-cloudops-engineer",
                "subtitle": "Amazon Web Services",
                "description": "Earned official AWS Certified CloudOps Engineer – Associate credential.",
                "date": "Apr 2026",
                "category": "Certification",
                "icon": "Award",
                "link": "https://cp.certmetrics.com/amazon/en/public/verify/credential/6a4511dc5dc84e709d958785ad74ba96",
                "order": 6,
            },
        ]
        for te in timeline_events:
            TimelineEvent.objects.update_or_create(slug=te["slug"], defaults=te)
        self.stdout.write("Processed Timeline Events.")

        # 10. SEO Metadata
        seo_data = [
            {
                "page_identifier": "home",
                "title": "Harsh Tripathi | Software Engineer (Backend & Cloud)",
                "description": "Backend-focused Software Engineer in Tokyo specializing in Python, Django, Celery, Docker, and AWS.",
            },
            {
                "page_identifier": "experience",
                "title": "Work Experience | Harsh Tripathi",
                "description": "Backend architecture, Celery async pipelines, Docker containerization, and AWS cloud infrastructure.",
            },
            {
                "page_identifier": "projects",
                "title": "Engineering Projects | Harsh Tripathi",
                "description": "Portfolio of production backend systems, personal CMS platforms, and financial pipelines.",
            },
            {
                "page_identifier": "skills",
                "title": "Technical Skills | Harsh Tripathi",
                "description": "Core competencies in Python, Django, Celery, MySQL, PostgreSQL, Docker, and AWS.",
            },
            {
                "page_identifier": "timeline",
                "title": "Career Timeline | Harsh Tripathi",
                "description": "Chronological history of achievements, education at IIIT Nagpur, and software engineering roles at SMS DataTech.",
            },
        ]
        for s in seo_data:
            SEOMetadata.objects.update_or_create(page_identifier=s["page_identifier"], defaults=s)
        self.stdout.write("Processed SEO Metadata.")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
