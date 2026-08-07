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
    help = "Seed & update data in Career OS PostgreSQL/SQLite database based on latest resume."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding & update process..."))

        # 0. Admin Superuser Creation
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@career-os.dev", "adminpassword123")
            self.stdout.write(self.style.SUCCESS("Created admin superuser (username: admin, password: adminpassword123)"))

        # 1. Site Settings
        settings_obj, _ = SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                "name": "Harsh Tripathi",
                "title": "Software Engineer (Backend and Cloud)",
                "email": "tripathiharsh324@gmail.com",
                "location": "Tokyo, Japan",
                "tagline": "Backend-focused Software Engineer building scalable systems using Python, Django, Celery & AWS.",
                "summary": (
                    "Backend-focused Software Engineer building scalable systems using Python, Django, and AWS. "
                    "Currently working on an AI-driven scraping platform with asynchronous processing (Celery) "
                    "and cloud deployment on AWS. Experienced in improving system performance, designing backend "
                    "architectures, and handling production workloads."
                ),
                "avatar_url": "https://github.com/Harsh324.png",
                "github_url": "https://github.com/Harsh324",
                "linkedin_url": "https://linkedin.com/in/harsh324",
                "twitter_url": "https://x.com/harsh324",
                "resume_url": "https://career-os.dev/resume.pdf",
            },
        )
        self.stdout.write("Updated Site Settings (Tokyo, Japan).")

        # 2. Technologies
        tech_data = [
            {"name": "Python", "slug": "python", "category": "Languages", "website": "https://www.python.org"},
            {"name": "JavaScript", "slug": "javascript", "category": "Languages", "website": "https://developer.mozilla.org"},
            {"name": "SQL", "slug": "sql", "category": "Languages", "website": ""},
            {"name": "Django", "slug": "django", "category": "Backend", "website": "https://www.djangoproject.com"},
            {"name": "Django REST Framework", "slug": "drf", "category": "Backend", "website": "https://www.django-rest-framework.org"},
            {"name": "Celery", "slug": "celery", "category": "Backend", "website": "https://docs.celeryq.dev"},
            {"name": "AWS", "slug": "aws", "category": "Cloud & Infra", "website": "https://aws.amazon.com"},
            {"name": "AWS ECS / Fargate", "slug": "ecs-fargate", "category": "Cloud & Infra", "website": ""},
            {"name": "CloudFormation", "slug": "cloudformation", "category": "Cloud & Infra", "website": ""},
            {"name": "Docker", "slug": "docker", "category": "DevOps", "website": "https://www.docker.com"},
            {"name": "GitHub Actions", "slug": "github-actions", "category": "DevOps", "website": "https://github.com/features/actions"},
            {"name": "Git", "slug": "git", "category": "DevOps", "website": "https://git-scm.com"},
            {"name": "MySQL", "slug": "mysql", "category": "Databases", "website": "https://www.mysql.com"},
            {"name": "MongoDB", "slug": "mongodb", "category": "Databases", "website": "https://www.mongodb.com"},
            {"name": "PostgreSQL", "slug": "postgresql", "category": "Databases", "website": "https://www.postgresql.org"},
            {"name": "Redis", "slug": "redis", "category": "Databases", "website": "https://redis.io"},
            {"name": "Distributed Systems", "slug": "distributed-systems", "category": "Architecture", "website": ""},
            {"name": "API Design", "slug": "api-design", "category": "Architecture", "website": ""},
            {"name": "System Design", "slug": "system-design", "category": "Architecture", "website": ""},
            {"name": "TypeScript", "slug": "typescript", "category": "Languages", "website": "https://www.typescriptlang.org"},
            {"name": "Next.js", "slug": "nextjs", "category": "Frameworks", "website": "https://nextjs.org"},
        ]
        tech_map = {}
        for item in tech_data:
            tech, _ = Technology.objects.update_or_create(slug=item["slug"], defaults=item)
            tech_map[item["slug"]] = tech
        self.stdout.write(f"Updated {len(tech_map)} Technologies.")

        # 3. Company
        company_obj, _ = Company.objects.update_or_create(
            slug="sms-datatech",
            defaults={
                "name": "SMS DataTech",
                "legal_name": "SMS DataTech Corporation",
                "logo": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80",
                "website": "https://www.sms-datatech.co.jp",
                "careers": "https://www.sms-datatech.co.jp/careers",
                "linkedin": "https://www.linkedin.com/company/sms-datatech",
                "industry": "Enterprise Software & Cloud Services",
                "company_size": "500-1000 employees",
                "headquarters": "Tokyo, Japan",
                "location": "Tokyo, Japan",
                "founded": "2001",
                "description": "SMS DataTech is a premier enterprise IT infrastructure and cloud engineering solutions provider headquartered in Tokyo, Japan.",
                "short_description": "Enterprise cloud infrastructure and backend engineering provider in Tokyo.",
            },
        )
        self.stdout.write("Updated SMS DataTech Company record.")

        # 4. Keep Current Projects (as requested)
        p1, _ = Project.objects.get_or_create(
            slug="career-os",
            defaults={
                "title": "Career OS",
                "summary": "Backend-driven Personal Engineering CMS and Portfolio platform.",
                "description": "Architected as a personal engineering CMS powering portfolio presentation, resume management, and project documentation.",
                "problem": "Static portfolio generators fail to provide dynamic content editing, centralized backend APIs, and real-time updates.",
                "solution": "Built a backend-driven CMS using Django REST Framework, PostgreSQL, Next.js, and Docker.",
                "status": "Active",
                "repository": "https://github.com/Harsh324/career-os",
                "demo": "https://career-os.dev",
                "featured": True,
                "timeline": "2024 - Present",
            },
        )
        p1.tech_stack.add(tech_map["python"], tech_map["django"], tech_map["postgresql"], tech_map["docker"], tech_map["nextjs"], tech_map["typescript"])

        p2, _ = Project.objects.get_or_create(
            slug="fintrack-ai",
            defaults={
                "title": "FinTrack AI",
                "summary": "AI-assisted automated financial transaction analysis backend platform.",
                "description": "High-throughput financial backend analyzing raw transaction streams using Python and PostgreSQL.",
                "problem": "Manual transaction classification failed under high volume.",
                "solution": "Built automated AI rule pipeline decreasing processing latency.",
                "status": "Active",
                "repository": "https://github.com/Harsh324/fintrack-ai",
                "featured": True,
                "timeline": "2023 - 2024",
            },
        )
        p2.tech_stack.add(tech_map["python"], tech_map["django"], tech_map["postgresql"], tech_map["redis"])

        p3, _ = Project.objects.get_or_create(
            slug="constellation",
            defaults={
                "title": "Constellation",
                "summary": "Containerized self-hosted homelab identity & infrastructure management engine.",
                "description": "Self-hosted identity management and container orchestration platform for personal homelab cloud infrastructure.",
                "problem": "Fragmented self-hosted services lacked unified identity access and container health monitoring.",
                "solution": "Engineered Docker-native identity gateway with central dashboard metrics.",
                "status": "Active",
                "repository": "https://github.com/Harsh324/constellation",
                "featured": True,
                "timeline": "2024",
            },
        )
        p3.tech_stack.add(tech_map["docker"], tech_map["aws"], tech_map["python"], tech_map["postgresql"])

        self.stdout.write("Preserved current Projects (Career OS, FinTrack AI, Constellation).")

        # 5. Experiences (Updated to match Resume)
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
                    "Designed and developed an AI-driven scraping platform using LLM-based modules for automated data extraction workflows",
                    "Built scalable asynchronous pipelines using Celery and queue-based task processing for complex workflows",
                    "Improved API performance by 20–30% through backend redesign and database optimization",
                    "Led backend system redesign including API structure, database schema, and backend architecture",
                    "Containerized services using Docker and contributed to deployments on AWS ECS/Fargate using CloudFormation",
                    "Managed AWS resources including EC2, ECS, S3, CloudWatch, and implemented Auto Scaling and Load Balancers",
                    "Handled 1000+ daily internal requests, ensuring system reliability and performance for internal use cases",
                    "Led backend task execution, feature prioritization, and technical mentorship for team members and interns"
                ],
                "challenges": [
                    {
                        "problem": "Dynamic website extraction required low-latency asynchronous task queue execution.",
                        "solution": "Engineered queue-based Celery pipelines with distributed worker pools.",
                        "impact": "Seamlessly handled complex workflows and improved API performance by 20-30%."
                    },
                    {
                        "problem": "Manual infrastructure provisioning created staging deployment delays.",
                        "solution": "Containerized services using Docker and automated AWS ECS/Fargate deployments via CloudFormation.",
                        "impact": "Achieved automated scaling, load balancing, and reliable 1000+ daily request handling."
                    }
                ],
                "metrics": [
                    {"label": "API Performance Gain", "value": "+20–30%"},
                    {"label": "Daily Internal Requests", "value": "1000+"},
                    {"label": "Cloud Platform", "value": "AWS ECS/Fargate"}
                ],
                "team": "SMS DataTech Backend & Cloud Engineering Team",
                "ownership": "Full ownership of AI scraping platform backend, Celery async queue architecture, and AWS CloudFormation infrastructure.",
                "lessons_learned": [
                    "Queue-based asynchronous task processing with Celery decouples long-running LLM extraction from synchronous API response cycles.",
                    "AWS CloudFormation template standardization ensures reliable reproducible deployments across staging and production."
                ],
            },
        )
        exp1.technologies.add(tech_map["python"], tech_map["django"], tech_map["celery"], tech_map["aws"], tech_map["docker"], tech_map["ecs-fargate"], tech_map["cloudformation"], tech_map["sql"])
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
                "mission": "Developed backend services using Django REST Framework for internal project dashboard (POGO).",
                "summary": "Designed and implemented REST APIs and relational database schemas using MySQL. Built multiple features from scratch to improve internal workflow visibility and collaborated with cross-functional teams.",
                "executive_overview": "Designed REST API endpoints, MySQL database schemas, and production-ready workflow tools for internal project dashboards.",
                "highlights": [
                    "Developed backend services using Django REST Framework for internal project dashboard (POGO)",
                    "Designed and implemented REST APIs and database schemas using MySQL",
                    "Built multiple features from scratch, improving internal workflow visibility",
                    "Collaborated with cross-functional teams to deliver production-ready features"
                ],
                "challenges": [
                    {
                        "problem": "Internal workflows lacked centralized visibility across active project tasks.",
                        "solution": "Designed REST APIs and MySQL relational schemas powering the internal POGO dashboard.",
                        "impact": "Delivered production-ready internal workflow visibility."
                    }
                ],
                "metrics": [
                    {"label": "Internal Dashboard", "value": "POGO"},
                    {"label": "Database Engine", "value": "MySQL"}
                ],
                "lessons_learned": [
                    "Designing clean REST API contracts and structured relational database schemas early simplifies frontend-backend integration."
                ],
            },
        )
        exp2.technologies.add(tech_map["python"], tech_map["django"], tech_map["drf"], tech_map["mysql"], tech_map["sql"], tech_map["git"])
        exp2.related_projects.add(p2)

        self.stdout.write("Updated Experience records (SMS DataTech Oct 2024–Present & Jul 2023–May 2024).")

        # 6. Skills (Updated to match Resume)
        skills_data = [
            {"name": "Python & Django Engineering", "slug": "python-django", "category": "Backend", "years": 3, "experience_level": "Expert", "order": 1},
            {"name": "Celery & Async Processing", "slug": "celery-async", "category": "Backend", "years": 2, "experience_level": "Expert", "order": 2},
            {"name": "AWS Cloud Architecture", "slug": "aws-cloud", "category": "Cloud & Infra", "years": 2, "experience_level": "Advanced", "order": 3},
            {"name": "Docker & Containerization", "slug": "docker-devops", "category": "DevOps", "years": 2, "experience_level": "Advanced", "order": 4},
            {"name": "MySQL & Database Optimization", "slug": "mysql-databases", "category": "Databases", "years": 2, "experience_level": "Advanced", "order": 5},
            {"name": "Distributed Systems & API Design", "slug": "distributed-api-design", "category": "Architecture", "years": 3, "experience_level": "Expert", "order": 6},
        ]
        for s in skills_data:
            sk, _ = Skill.objects.update_or_create(slug=s["slug"], defaults=s)
        self.stdout.write("Updated Skills.")

        # 7. Education (IIIT Nagpur Dec 2020 – Jun 2024, CGPA: 7.8)
        Education.objects.update_or_create(
            slug="iiit-nagpur",
            defaults={
                "institution": "Indian Institute of Information Technology (IIIT Nagpur)",
                "degree": "B.Tech in Computer Science and Engineering",
                "field_of_study": "Computer Science and Engineering",
                "location": "Nagpur, India",
                "start_date": "Dec 2020",
                "end_date": "Jun 2024",
                "grade": "CGPA: 7.8",
                "achievements": [
                    "Completed B.Tech in Computer Science and Engineering with a CGPA of 7.8.",
                    "Studied Core Computer Science, Distributed Systems, Relational Databases, and System Design."
                ],
                "relevant_courses": [
                    "Data Structures & Algorithms", "Operating Systems", "Database Management Systems", "Computer Networks", "System Design"
                ],
            },
        )
        self.stdout.write("Updated Education (IIIT Nagpur, Dec 2020 – Jun 2024, CGPA 7.8).")

        # 8. Certifications (Exact AWS CertMetrics credentials)
        Certification.objects.filter(slug__in=["aws-architect", "aws-sysops-administrator"]).delete()

        Certification.objects.update_or_create(
            slug="aws-solutions-architect",
            defaults={
                "name": "AWS Certified Solutions Architect - Associate",
                "issuer": "Amazon Web Services",
                "credential_url": "https://cp.certmetrics.com/amazon/en/public/verify/credential/9c0287d7cbf04661a24c19a061a02e76",
                "issue_date": "2025-08-19",
                "expiry_date": "2028-08-19",
            },
        )
        Certification.objects.update_or_create(
            slug="aws-cloudops-engineer",
            defaults={
                "name": "AWS Certified CloudOps Engineer - Associate",
                "issuer": "Amazon Web Services",
                "credential_url": "https://cp.certmetrics.com/amazon/en/public/verify/credential/6a4511dc5dc84e709d958785ad74ba96",
                "issue_date": "2026-04-01",
                "expiry_date": "2029-04-01",
            },
        )
        self.stdout.write("Updated Certifications (AWS Solutions Architect & AWS CloudOps Engineer).")

        # 9. Timeline Events (Clean chronologically ordered sequence matching official resume)
        TimelineEvent.objects.all().delete()

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
                "description": "Developed backend services using Django REST Framework and MySQL for internal project dashboards (POGO).",
                "date": "Jul 2023 – May 2024",
                "category": "Career",
                "icon": "Briefcase",
                "order": 2,
            },
            {
                "title": "B.Tech Computer Science Graduation",
                "slug": "3-iiit-nagpur-graduation",
                "subtitle": "IIIT Nagpur (CGPA: 7.8)",
                "description": "Graduated with B.Tech in Computer Science and Engineering from IIIT Nagpur with CGPA 7.8.",
                "date": "Jun 2024",
                "category": "Education",
                "icon": "GraduationCap",
                "order": 3,
            },
            {
                "title": "Software Engineer (Backend and Cloud)",
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
                "subtitle": "Amazon Web Services (Verified Credential)",
                "description": "Earned official AWS Certified Solutions Architect – Associate credential (Validation ID: 9c0287d7cbf04661a24c19a061a02e76).",
                "date": "Aug 2025",
                "category": "Certification",
                "icon": "Award",
                "link": "https://cp.certmetrics.com/amazon/en/public/verify/credential/9c0287d7cbf04661a24c19a061a02e76",
                "order": 5,
            },
            {
                "title": "AWS Certified CloudOps Engineer – Associate",
                "slug": "6-aws-cloudops-engineer",
                "subtitle": "Amazon Web Services (Verified Credential)",
                "description": "Earned official AWS Certified CloudOps Engineer – Associate credential (Validation ID: 6a4511dc5dc84e709d958785ad74ba96).",
                "date": "Apr 2026",
                "category": "Certification",
                "icon": "Award",
                "link": "https://cp.certmetrics.com/amazon/en/public/verify/credential/6a4511dc5dc84e709d958785ad74ba96",
                "order": 6,
            },
        ]
        for te in timeline_events:
            TimelineEvent.objects.create(**te)
        self.stdout.write("Seeded 6 clean, accurate Timeline Events.")

        # 10. SEO Metadata
        seo_data = [
            {"page_identifier": "home", "title": "Harsh Tripathi | Software Engineer (Backend & Cloud)", "description": "Backend-focused Software Engineer in Tokyo specializing in Python, Django, Celery, Docker, and AWS."},
            {"page_identifier": "experience", "title": "Work Experience | Harsh Tripathi", "description": "Backend platform architecture, Celery async pipelines, Docker containerization, and AWS ECS/Fargate infrastructure."},
            {"page_identifier": "projects", "title": "Engineering Projects | Harsh Tripathi", "description": "Portfolio of production backend systems, personal CMS platforms, and financial pipelines."},
            {"page_identifier": "skills", "title": "Technical Skills | Harsh Tripathi", "description": "Core competencies in Python, Django, Celery, MySQL, MongoDB, Docker, and AWS."},
            {"page_identifier": "timeline", "title": "Milestones & Timeline | Harsh Tripathi", "description": "Chronological history of achievements, education at IIIT Nagpur, and software engineering roles at SMS DataTech."},
        ]
        for s in seo_data:
            SEOMetadata.objects.update_or_create(page_identifier=s["page_identifier"], defaults=s)
        self.stdout.write("Updated SEO Metadata.")

        self.stdout.write(self.style.SUCCESS("Database seeding & update completed successfully!"))
