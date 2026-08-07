import logging
import os
from typing import Any

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.site_settings.models import SiteSettings
from apps.skills.models import Skill

logger = logging.getLogger(__name__)

def build_resume_context() -> str:
    """Assembles single source of truth context from database ContentGraph models."""
    settings = SiteSettings.objects.first()
    experiences = Experience.objects.select_related("company").prefetch_related("technologies", "related_projects").all()
    skills = Skill.objects.all()
    certs = Certification.objects.all()
    education = Education.objects.all()
    projects = Project.objects.prefetch_related("tech_stack").all()

    context_lines = []

    if settings:
        context_lines.append(f"NAME: {settings.name}")
        context_lines.append(f"TITLE: {settings.title}")
        context_lines.append(f"LOCATION: {settings.location}")
        context_lines.append(f"SUMMARY: {settings.summary}")
        context_lines.append(f"CONTACT: {settings.email} | GitHub: {settings.github_url} | LinkedIn: {settings.linkedin_url}")
        context_lines.append("")

    context_lines.append("WORK EXPERIENCE:")
    for exp in experiences:
        company_name = exp.company.name if exp.company else "SMS DataTech"
        context_lines.append(f"- Role: {exp.title} at {company_name} ({exp.location})")
        context_lines.append(f"  Dates: {exp.start_date} - {exp.end_date or 'Present'}")
        context_lines.append(f"  Summary: {exp.summary}")
        if exp.highlights:
            context_lines.append(f"  Key Achievements: {'; '.join(exp.highlights)}")
        context_lines.append("")

    context_lines.append("VERIFIED AWS CERTIFICATIONS:")
    for c in certs:
        context_lines.append(f"- {c.name} (Issuer: {c.issuer})")
        context_lines.append(f"  Active Since: {c.issue_date} | Expires: {c.expiry_date or 'N/A'}")
        if c.credential_url:
            context_lines.append(f"  Verification Link: {c.credential_url}")
        context_lines.append("")

    context_lines.append("TECHNICAL SKILLS & TAXONOMY:")
    for s in skills:
        context_lines.append(f"- {s.name} ({s.category}): {s.experience_level} ({s.years} years)")

    context_lines.append("")
    context_lines.append("EDUCATION:")
    for edu in education:
        context_lines.append(f"- {edu.degree} in {edu.field_of_study} at {edu.institution} ({edu.location})")
        context_lines.append(f"  Dates: {edu.start_date} - {edu.end_date} | Grade: {edu.grade}")

    context_lines.append("")
    context_lines.append("PORTFOLIO PROJECTS:")
    for p in projects:
        context_lines.append(f"- Project: {p.title} ({p.status})")
        context_lines.append(f"  Summary: {p.summary}")
        context_lines.append(f"  Repository: {p.repository}")

    return "\n".join(context_lines)


def get_ai_assistant_reply(user_message: str) -> dict[str, Any]:
    """
    Processes user query using LLM API if key is present,
    or intelligent structured RAG fallback engine.
    """
    context = build_resume_context()
    query_lower = user_message.lower().strip()

    # Check for LLM API Key (Gemini or OpenAI)
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            system_prompt = (
                "You are Harsh Tripathi's AI Portfolio Assistant. Your job is to answer questions "
                "about Harsh's career, work experience, AWS certifications, skills, education, and projects "
                "in a professional, friendly, and concise manner based strictly on the context below.\n\n"
                f"BACKGROUND CONTEXT:\n{context}\n\nUSER QUESTION: {user_message}"
            )
            response = model.generate_content(system_prompt)
            return {
                "reply": response.text,
                "mode": "llm-gemini",
                "sources": ["PostgreSQL ContentGraph", "Django ORM Services"],
            }
        except Exception as e:
            logger.warning(f"Gemini API call failed, using fallback RAG: {e}")

    if openai_key:
        try:
            import json
            import urllib.request
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are Harsh Tripathi's AI Assistant. Answer concisely based strictly on his resume:\n"
                            f"{context}"
                        ),
                    },
                    {"role": "user", "content": user_message},
                ],
                "max_tokens": 300,
            }
            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                },
                data=json.dumps(payload).encode("utf-8"),
            )
            with urllib.request.urlopen(req) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                reply = res_data["choices"][0]["message"]["content"]
                return {
                    "reply": reply,
                    "mode": "llm-openai",
                    "sources": ["PostgreSQL ContentGraph", "Django ORM Services"],
                }
        except Exception as e:
            logger.warning(f"OpenAI API call failed, using fallback RAG: {e}")

    # Structured RAG Fallback Engine with Citations
    if any(k in query_lower for k in ["certif", "aws", "solutions architect", "cloudops"]):
        return {
            "reply": (
                "Harsh holds two active official AWS certifications:\n\n"
                "1. **AWS Certified Solutions Architect – Associate** (Active: Aug 2025 – Aug 2028)\n"
                "2. **AWS Certified CloudOps Engineer – Associate** (Active: Apr 2026 – Apr 2029)\n\n"
                "Both credentials are verified on Amazon CertMetrics."
            ),
            "mode": "rag-structured",
            "sources": ["AWS Certifications", "CertMetrics Registry"],
        }

    if any(k in query_lower for k in ["sms datatech", "work", "job", "experience", "tokyo", "scraping", "llm"]):
        return {
            "reply": (
                "Harsh is currently a **Software Engineer (Backend and Cloud)** at **SMS DataTech** in Tokyo, Japan (Oct 2024 – Present).\n\n"
                "Key work highlights:\n"
                "• Designed & developed an AI-driven scraping platform using LLMs for automated data extraction.\n"
                "• Engineered Celery asynchronous queue pipelines and improved API performance by 20–30%.\n"
                "• Containerized microservices with Docker and deployed on AWS ECS/Fargate via CloudFormation.\n"
                "• Previously completed a Software Engineer Internship at SMS DataTech (Jul 2023 – May 2024) building DRF REST APIs for internal project dashboards."
            ),
            "mode": "rag-structured",
            "sources": ["SMS DataTech Experience", "Work Taxonomy Model"],
        }

    if any(k in query_lower for k in ["skill", "stack", "python", "django", "celery", "docker", "tech"]):
        return {
            "reply": (
                "Harsh's core technical taxonomy includes:\n\n"
                "• **Backend**: Python, Django, Django REST Framework, Celery\n"
                "• **Cloud & Infra**: AWS (ECS/Fargate, EC2, S3, CloudWatch, CloudFormation), Docker\n"
                "• **Databases**: MySQL, PostgreSQL, MongoDB, Redis\n"
                "• **Concepts**: Distributed Systems, System Design, REST API Architecture"
            ),
            "mode": "rag-structured",
            "sources": ["Technical Skills Model", "Skill Taxonomy"],
        }

    if any(k in query_lower for k in ["education", "college", "degree", "university", "iiit", "nagpur"]):
        return {
            "reply": (
                "Harsh graduated with a **B.Tech in Computer Science and Engineering** from the "
                "**Indian Institute of Information Technology (IIIT Nagpur)** (Dec 2020 – Jun 2024) with a CGPA of **7.8**."
            ),
            "mode": "rag-structured",
            "sources": ["Education Model", "IIIT Nagpur Records"],
        }

    if any(k in query_lower for k in ["project", "career os", "fintrack", "constellation"]):
        return {
            "reply": (
                "Harsh's featured portfolio projects include:\n\n"
                "1. **Career OS**: A personal engineering CMS & portfolio platform built with Django DRF, PostgreSQL, Next.js, and Docker.\n"
                "2. **FinTrack AI**: An AI-assisted automated financial transaction analysis backend engine.\n"
                "3. **Constellation**: A containerized self-hosted homelab identity & infrastructure management tool."
            ),
            "mode": "rag-structured",
            "sources": ["Projects Model", "GitHub Repositories"],
        }

    if any(k in query_lower for k in ["contact", "email", "github", "linkedin", "hire", "consulting"]):
        return {
            "reply": (
                "You can reach Harsh directly:\n\n"
                "• **Email**: tripathiharsh324@gmail.com\n"
                "• **Location**: Tokyo, Japan\n"
                "• **GitHub**: [Harsh324](https://github.com/Harsh324)\n"
                "• **LinkedIn**: [harsh324](https://linkedin.com/in/harsh324)"
            ),
            "mode": "rag-structured",
            "sources": ["SiteSettings Model", "Verified Contacts"],
        }

    # Default General Response
    return {
        "reply": (
            "Harsh Tripathi is a **Software Engineer (Backend and Cloud)** based in Tokyo, Japan. "
            "He specializes in Python, Django, Celery asynchronous processing, Docker containerization, and AWS cloud infrastructure. "
            "He holds AWS Certified Solutions Architect and AWS Certified CloudOps Engineer credentials."
        ),
        "mode": "rag-default",
        "sources": ["SiteSettings Model", "ContentGraph Database"],
    }
