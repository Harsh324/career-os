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
                "summary": "Backend-driven engineering portfolio platform built with Django REST Framework, PostgreSQL, Next.js, and Docker containerization.",
                "description": "Architected as a backend-driven engineering portfolio platform with Django REST Framework as the centralized source of truth for portfolio content.",
                "problem": "Static portfolio generators lack dynamic content editing, centralized backend APIs, and structured data management.",
                "solution": "Built a Django REST backend that acts as the centralized source of truth for portfolio content, with a Next.js frontend consuming structured API data.",
                "status": "Active",
                "repository": "https://github.com/Harsh324/career-os",
                "demo": "https://career-os.dev",
                "featured": True,
                "order": 3,
                "timeline": "2026 – Present",
            },
        )
        p1.timeline = "2026 – Present"
        p1.order = 3
        p1.save()
        p1.tech_stack.add(
            tech_map["python"],
            tech_map["django"],
            tech_map["postgresql"],
            tech_map["docker"],
            tech_map["nextjs"],
            tech_map["typescript"],
        )

        p2, _ = Project.objects.update_or_create(
            slug="fintrack-ai",
            defaults={
                "title": "FinTrack AI",
                "summary": "Financial management platform for transaction tracking, automated transaction categorization, and shared expense management.",
                "description": "Financial backend engine built with Python, Django, PostgreSQL, and Redis. Features include transaction tracking, automated categorization, and shared expense management, with OCR-based automated bill splitting currently in development.",
                "problem": "Manual transaction tracking and shared expense management is prone to errors.",
                "solution": "Built a centralized financial management platform leveraging automated categorization rules.",
                "status": "Active Development",
                "repository": "https://github.com/Harsh324/fintrack-ai",
                "demo": "",
                "featured": True,
                "order": 1,
                "timeline": "2026 – Present",
            },
        )
        p2.timeline = "2026 – Present"
        p2.order = 1
        p2.save()
        p2.tech_stack.add(
            tech_map["python"], tech_map["django"], tech_map["postgresql"], tech_map["redis"]
        )

        p3, _ = Project.objects.update_or_create(
            slug="constellation",
            defaults={
                "title": "Constellation",
                "summary": "Self-hosted infrastructure platform for securely running and managing containerized services on a personal homelab.",
                "description": "Built on Ubuntu Linux with Cloudflare Tunnels, Traefik reverse proxy, shared PostgreSQL/Redis storage, and automated encrypted daily S3 backups.",
                "problem": "Exposing self-hosted services directly to the internet creates firewall attack surfaces, while unmanaged containers risk data loss without automated backups and health monitoring.",
                "solution": "Built an automated infrastructure setup with zero open inbound ports using Cloudflare Tunnels, Traefik v3 dynamic routing, isolated internal container networks, and encrypted offsite backups.",
                "status": "Active / v0.9.2 Baseline",
                "repository": "https://github.com/Harsh324/constellation",
                "demo": "https://portal.constellationhq.dev/",
                "featured": True,
                "order": 2,
                "timeline": "2026 – Present",
            },
        )
        p3.summary = "Self-hosted infrastructure platform for securely running and managing containerized services on a personal homelab."
        p3.description = "Built on Ubuntu Linux with Cloudflare Tunnels, Traefik reverse proxy, shared PostgreSQL/Redis storage, and automated encrypted daily S3 backups."
        p3.problem = "Exposing self-hosted services directly to the internet creates firewall attack surfaces, while unmanaged containers risk data loss without automated backups and health monitoring."
        p3.solution = "Built an automated infrastructure setup with zero open inbound ports using Cloudflare Tunnels, Traefik v3 dynamic routing, isolated internal container networks, and encrypted offsite backups."
        p3.status = "Active / v0.9.2 Baseline"
        p3.demo = "https://portal.constellationhq.dev/"
        p3.repository = "https://github.com/Harsh324/constellation"
        p3.timeline = "2026 – Present"
        p3.order = 2
        p3.save()
        p3.tech_stack.set(
            [
                tech_map["docker"],
                tech_map["traefik"],
                tech_map["postgresql"],
                tech_map["cloudflare"],
                tech_map["ubuntu-linux"],
            ]
        )

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

        # 6. Skills (Clean Categorized Competencies without pseudo-precision or duplication)
        Skill.objects.all().delete()
        skills_data = [
            # 1. Backend Engineering
            {
                "name": "Python",
                "slug": "python-skill",
                "category": "Backend Engineering",
                "order": 1,
                "is_core": True,
            },
            {
                "name": "Django",
                "slug": "django-skill",
                "category": "Backend Engineering",
                "order": 2,
                "is_core": True,
            },
            {
                "name": "Django REST Framework",
                "slug": "drf-skill",
                "category": "Backend Engineering",
                "order": 3,
                "is_core": True,
            },
            {
                "name": "Celery",
                "slug": "celery-skill",
                "category": "Backend Engineering",
                "order": 4,
                "is_core": True,
            },
            {
                "name": "REST API Design",
                "slug": "rest-api-design-skill",
                "category": "Backend Engineering",
                "order": 5,
            },
            {
                "name": "API Performance Optimization",
                "slug": "api-performance-skill",
                "category": "Backend Engineering",
                "order": 6,
            },
            # 2. Cloud & Infrastructure
            {
                "name": "AWS",
                "slug": "aws-skill",
                "category": "Cloud & Infrastructure",
                "order": 1,
                "is_core": True,
            },
            {
                "name": "ECS / Fargate",
                "slug": "ecs-fargate-skill",
                "category": "Cloud & Infrastructure",
                "order": 2,
                "is_core": True,
            },
            {
                "name": "AWS Cloud Architecture",
                "slug": "aws-cloud-arch-skill",
                "category": "Cloud & Infrastructure",
                "order": 3,
            },
            {"name": "EC2", "slug": "ec2-skill", "category": "Cloud & Infrastructure", "order": 4},
            {"name": "S3", "slug": "s3-skill", "category": "Cloud & Infrastructure", "order": 5},
            {
                "name": "CloudFormation",
                "slug": "cloudformation-skill",
                "category": "Cloud & Infrastructure",
                "order": 6,
            },
            {
                "name": "CloudWatch",
                "slug": "cloudwatch-skill",
                "category": "Cloud & Infrastructure",
                "order": 7,
            },
            # 3. Architecture & Distributed Systems
            {
                "name": "Distributed Systems",
                "slug": "distributed-systems-skill",
                "category": "Architecture & Distributed Systems",
                "order": 1,
            },
            {
                "name": "Asynchronous Architecture",
                "slug": "async-architecture-skill",
                "category": "Architecture & Distributed Systems",
                "order": 2,
            },
            {
                "name": "Caching & Performance",
                "slug": "caching-performance-skill",
                "category": "Architecture & Distributed Systems",
                "order": 3,
            },
            {
                "name": "System & API Design",
                "slug": "system-api-design-skill",
                "category": "Architecture & Distributed Systems",
                "order": 4,
            },
            # 4. Databases & Caching
            {
                "name": "PostgreSQL",
                "slug": "postgresql-skill",
                "category": "Databases & Caching",
                "order": 1,
                "is_core": True,
            },
            {"name": "MySQL", "slug": "mysql-skill", "category": "Databases & Caching", "order": 2},
            {"name": "Redis", "slug": "redis-skill", "category": "Databases & Caching", "order": 3},
            {
                "name": "Database Optimization",
                "slug": "database-optimization-skill",
                "category": "Databases & Caching",
                "order": 4,
            },
            {
                "name": "Query Performance / Indexing",
                "slug": "query-performance-skill",
                "category": "Databases & Caching",
                "order": 5,
            },
            # 5. AI & Data
            {"name": "LLM Integrations", "slug": "llm-skill", "category": "AI & Data", "order": 1},
            {
                "name": "AI/Data Extraction",
                "slug": "ai-extraction-skill",
                "category": "AI & Data",
                "order": 2,
            },
            {
                "name": "Data Processing Pipelines",
                "slug": "data-pipelines-skill",
                "category": "AI & Data",
                "order": 3,
            },
            # 6. DevOps & CI/CD
            {
                "name": "Docker",
                "slug": "docker-skill",
                "category": "DevOps & CI/CD",
                "order": 1,
                "is_core": True,
            },
            {"name": "Git & GitHub", "slug": "git-skill", "category": "DevOps & CI/CD", "order": 2},
            {
                "name": "GitHub Actions",
                "slug": "github-actions-skill",
                "category": "DevOps & CI/CD",
                "order": 3,
            },
            {
                "name": "CI/CD Pipelines",
                "slug": "cicd-skill",
                "category": "DevOps & CI/CD",
                "order": 4,
            },
            {
                "name": "Containerization",
                "slug": "containerization-skill",
                "category": "DevOps & CI/CD",
                "order": 5,
            },
            # 7. Supporting Technologies
            {
                "name": "TypeScript",
                "slug": "typescript-skill",
                "category": "Supporting Technologies",
                "order": 1,
            },
            {
                "name": "Next.js",
                "slug": "nextjs-skill",
                "category": "Supporting Technologies",
                "order": 2,
            },
        ]
        for s in skills_data:
            Skill.objects.update_or_create(slug=s["slug"], defaults=s)
        self.stdout.write("Processed Skills.")

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
