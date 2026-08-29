import json
import logging
import os
import time
from typing import Any, Generator

from django.conf import settings as django_settings
from django.core.cache import cache

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.site_settings.models import SiteSettings
from apps.skills.models import Skill

logger = logging.getLogger(__name__)

CACHE_RESUME_CONTEXT_KEY = "ai_resume_context"
CACHE_RESUME_CONTEXT_TIMEOUT = 3600  # 1 hour TTL


def build_resume_context() -> str:
    """Assembles single source of truth context from database ContentGraph models with caching."""
    cached_context = cache.get(CACHE_RESUME_CONTEXT_KEY)
    if cached_context:
        return cached_context

    settings = SiteSettings.objects.first()
    experiences = (
        Experience.objects.select_related("company")
        .prefetch_related("technologies", "related_projects")
        .all()
    )
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
        context_lines.append(
            f"CONTACT: {settings.email} | GitHub: {settings.github_url} | LinkedIn: {settings.linkedin_url}"
        )
        context_lines.append("")

    context_lines.append("WORK EXPERIENCE:")
    for exp in experiences:
        company_name = exp.company.name if exp.company else "SMS DataTech"
        context_lines.append(f"- Role: {exp.title} at {company_name} ({exp.location})")
        context_lines.append(
            f"  Type: {exp.employment_type} | Dates: {exp.start_date} - {exp.end_date or 'Present'}"
        )
        context_lines.append(f"  Summary: {exp.summary}")
        if exp.highlights:
            context_lines.append(f"  Key Contributions: {'; '.join(exp.highlights)}")
        if exp.metrics:
            metrics_str = "; ".join(
                [f"{m.get('value')} ({m.get('label')})" for m in exp.metrics if isinstance(m, dict)]
            )
            if metrics_str:
                context_lines.append(f"  Verified Metrics: {metrics_str}")
        context_lines.append("")

    context_lines.append("AWS CERTIFICATIONS:")
    for c in certs:
        context_lines.append(f"- {c.name} (Issuer: {c.issuer})")
        context_lines.append(
            f"  Active Since: {c.issue_date} | Expires: {c.expiry_date or 'N/A'}"
        )
        if c.credential_url:
            context_lines.append(f"  Credential Link: {c.credential_url}")
        context_lines.append("")

    context_lines.append("TECHNICAL SKILLS:")
    for s in skills:
        context_lines.append(f"- {s.name} ({s.category})")

    context_lines.append("")
    context_lines.append("EDUCATION:")
    for edu in education:
        context_lines.append(
            f"- {edu.degree} in {edu.field_of_study} at {edu.institution} ({edu.location})"
        )
        context_lines.append(
            f"  Dates: {edu.start_date} - {edu.end_date} | Grade: {edu.grade}"
        )

    context_lines.append("")
    context_lines.append("PORTFOLIO PROJECTS:")
    for p in projects:
        context_lines.append(f"- Project: {p.title} ({p.status})")
        context_lines.append(f"  Summary: {p.summary}")
        if p.repository:
            context_lines.append(f"  Repository: {p.repository}")
        if p.demo:
            context_lines.append(f"  Live Demo: {p.demo}")

    result = "\n".join(context_lines)
    cache.set(CACHE_RESUME_CONTEXT_KEY, result, timeout=CACHE_RESUME_CONTEXT_TIMEOUT)
    return result


SYSTEM_GUARDRAILS = (
    "You are Harsh Tripathi's AI Portfolio Assistant. You answer questions strictly based on the "
    "approved Career OS database context provided below.\n\n"
    "STRICT RULES:\n"
    "1. Never invent, estimate, or hallucinate private information, phone numbers, salary expectations, "
    "unsupported technologies, fake achievements, or metrics.\n"
    "2. If asked about information not in the context (such as salary, private phone, or non-portfolio topics), "
    "gracefully reply: 'I don't have recorded data on [topic] in Career OS. For verified details, please visit "
    "Harsh's [Work Experience](/experience), [Projects](/projects), or [Resume](/resume) pages.'\n"
    "3. Structure your answers concisely with clear bullet points where appropriate.\n"
    "4. Include relative markdown links to relevant portfolio pages "
    "([Work Experience](/experience), [Projects](/projects), [Skills & Stack](/skills), [Resume](/resume)) "
    "when appropriate.\n"
)


def extract_action_cards(reply_text: str, settings: Any = None) -> list[dict[str, str]]:
    """Detects context in the conversation to return dynamic recruiter action cards."""
    if settings is None:
        settings = SiteSettings.objects.first()
    email = settings.email if settings else "harsh324.dev@gmail.com"
    text_lower = reply_text.lower()
    cards = []

    if any(k in text_lower for k in ["contact", "email", "reach", "hire", "interview", "get in touch", "connect"]):
        cards.append({
            "type": "email",
            "label": "Email Harsh Directly",
            "url": f"mailto:{email}?subject=Discussion%20re%3A%20Backend%20%26%20Cloud%20Engineering%20Role",
            "icon": "Mail",
            "variant": "primary",
        })
        if settings and getattr(settings, "linkedin_url", None):
            cards.append({
                "type": "linkedin",
                "label": "Connect on LinkedIn",
                "url": settings.linkedin_url,
                "icon": "ArrowUpRight",
                "variant": "default",
            })

    if any(k in text_lower for k in ["resume", "cv", "profile", "open to", "role"]) and len(cards) < 2:
        cards.append({
            "type": "resume",
            "label": "View / Download Resume PDF",
            "url": "/resume",
            "icon": "FileText",
            "variant": "primary" if not cards else "default",
        })

    if any(k in text_lower for k in ["fintrack", "financial", "fintech", "market data"]) and len(cards) < 2:
        cards.append({
            "type": "project",
            "label": "FinTrack AI Deep-Dive",
            "url": "/projects/fintrack-ai",
            "icon": "TrendingUp",
            "variant": "default",
        })
    elif any(k in text_lower for k in ["constellation", "homelab", "traefik", "tunnel", "self-hosted"]) and len(cards) < 2:
        cards.append({
            "type": "project",
            "label": "Constellation Homelab Architecture",
            "url": "/projects/constellation",
            "icon": "Layers",
            "variant": "default",
        })
    elif any(k in text_lower for k in ["career os", "career-os", "portfolio"]) and len(cards) < 2:
        cards.append({
            "type": "project",
            "label": "Career OS Architecture",
            "url": "/projects/career-os",
            "icon": "Layers",
            "variant": "default",
        })
    elif any(k in text_lower for k in ["sms datatech", "japan", "tokyo", "scraping", "scrap"]) and len(cards) < 2:
        cards.append({
            "type": "experience",
            "label": "SMS DataTech Role Details",
            "url": "/experience",
            "icon": "Briefcase",
            "variant": "default",
        })
    elif any(k in text_lower for k in ["aws", "certification", "solutions architect", "cloudops"]) and len(cards) < 2:
        cards.append({
            "type": "skills",
            "label": "Verify AWS Certifications",
            "url": "/skills",
            "icon": "Award",
            "variant": "default",
        })

    return cards[:2]


def extract_suggestions(reply_text: str) -> list[str]:
    """Generates contextual follow-up questions for the recruiter."""
    text_lower = reply_text.lower()

    if "sms datatech" in text_lower or "tokyo" in text_lower:
        return [
            "What AWS services did Harsh use at SMS DataTech?",
            "Tell me about the FinTrack AI project",
            "Is Harsh open to new roles?",
        ]
    if "fintrack" in text_lower:
        return [
            "How did FinTrack AI handle market data ingestion?",
            "What AWS certifications does Harsh hold?",
            "View Harsh's full resume",
        ]
    if "aws" in text_lower or "certif" in text_lower:
        return [
            "What is Harsh's experience with Python & Django?",
            "Tell me about SMS DataTech platform work",
            "How can I contact Harsh?",
        ]
    if "skill" in text_lower or "python" in text_lower or "django" in text_lower:
        return [
            "Tell me about asynchronous systems & Celery",
            "What projects showcase his backend skills?",
            "Download Harsh's resume",
        ]

    return [
        "What did Harsh build at SMS DataTech?",
        "What are his AWS certifications?",
        "What backend technologies does he specialize in?",
    ]


def normalize_messages(messages_input: Any) -> list[dict[str, str]]:
    """Converts either a raw string or list of message objects into standard format."""
    if isinstance(messages_input, str):
        return [{"role": "user", "content": messages_input.strip()}]
    if isinstance(messages_input, list):
        normalized = []
        for m in messages_input:
            if isinstance(m, dict) and "content" in m:
                role = m.get("role", "user")
                content = str(m.get("content", "")).strip()
                if content:
                    normalized.append({"role": role, "content": content})
            elif isinstance(m, dict) and "text" in m:
                role = "user" if m.get("sender") == "user" else "assistant"
                content = str(m.get("text", "")).strip()
                if content:
                    normalized.append({"role": role, "content": content})
        return normalized if normalized else [{"role": "user", "content": "Hello"}]
    return [{"role": "user", "content": "Hello"}]


def _fallback_rag_response(last_user_query: str, settings: Any = None) -> dict[str, Any]:
    """Zero-cost heuristic RAG response generator."""
    if settings is None:
        settings = SiteSettings.objects.first()
    first_name = settings.name.split(" ")[0] if settings and settings.name else "Harsh"
    email = settings.email if settings else "harsh324.dev@gmail.com"
    query_lower = last_user_query.lower()

    if any(k in query_lower for k in ["salary", "pay", "compensation", "money", "phone", "number"]):
        reply = (
            f"I don't have recorded data regarding compensation or private contact numbers in Career OS. "
            f"You can reach {first_name} directly via email at {email}, or view details on the [Resume](/resume) page."
        )
        sources = ["SiteSettings Schema"]
    elif any(k in query_lower for k in ["certif", "aws", "solutions architect", "cloudops"]):
        certs = Certification.objects.all()
        cert_lines = "\n".join([f"- **{c.name}** (Active: {c.issue_date} – {c.expiry_date or 'Active'})" for c in certs])
        reply = (
            f"{first_name} holds the following verified certifications:\n\n{cert_lines}\n\n"
            "You can inspect verified credentials on the [Skills & Stack](/skills) page."
        )
        sources = ["AWS Certifications Model"]
    elif any(k in query_lower for k in ["work", "job", "experience", "sms datatech", "scraping", "japan", "tokyo"]):
        exp = Experience.objects.filter(current_position=True).first()
        current_role = f"**{exp.title}** at **{exp.company.name}** in Tokyo, Japan" if exp else "a Backend & Cloud Engineer"
        reply = (
            f"{first_name} works as {current_role}.\n\n"
            f"**Key Engineering Focus**:\n"
            f"- Built distributed data ingestion pipelines processing 1M+ records daily\n"
            f"- Achieved 20–30% API performance improvements via Django query optimization & Redis caching\n"
            f"- Architected AWS infrastructure across ECS, SQS, S3, and RDS PostgreSQL\n\n"
            f"Read full role details on the [Work Experience](/experience) page."
        )
        sources = ["Work Experience Model", "PostgreSQL ContentGraph"]
    elif any(k in query_lower for k in ["skill", "stack", "python", "django", "celery", "docker", "tech", "database"]):
        reply = (
            f"{first_name}'s core engineering stack is centered on:\n\n"
            f"- **Backend**: Python, Django REST Framework, Celery, FastAPI, Node.js\n"
            f"- **Cloud & Infra**: AWS (ECS, SQS, S3, Lambda, CloudWatch), Docker, GitHub Actions CI/CD\n"
            f"- **Databases & Caching**: PostgreSQL, Redis, Query Optimization, Vector Stores\n"
            f"- **Frontend & Presentation**: Next.js 15, TypeScript, Tailwind CSS\n\n"
            f"Explore the interactive breakdown on the [Skills & Stack](/skills) page."
        )
        sources = ["Technical Skills Model"]
    elif any(k in query_lower for k in ["education", "college", "degree", "university", "iiit"]):
        edu = Education.objects.first()
        edu_text = f"a **{edu.degree}** in **{edu.field_of_study}** from **{edu.institution}**" if edu else "a degree in Computer Science"
        reply = (
            f"{first_name} graduated with {edu_text}.\n\n"
            "View educational background and coursework on the [Resume](/resume) page."
        )
        sources = ["Education Model"]
    elif any(k in query_lower for k in ["project", "career os", "fintrack", "constellation"]):
        projects = Project.objects.filter(featured=True)[:3]
        proj_lines = "\n".join([f"- **{p.title}**: {p.summary}" for p in projects])
        reply = (
            f"{first_name}'s featured backend & AI projects include:\n\n{proj_lines}\n\n"
            "Check out full architecture diagrams on the [Projects Showcase](/projects) page."
        )
        sources = ["Projects ContentGraph"]
    elif any(k in query_lower for k in ["contact", "email", "github", "linkedin", "hire", "reach", "open"]):
        github = settings.github_url if settings else "https://github.com/Harsh324"
        linkedin = settings.linkedin_url if settings else "https://linkedin.com"
        location = settings.location if settings else "Tokyo, Japan / Worldwide"
        reply = (
            f"{first_name} is currently open to **Backend, Cloud & Platform Engineering roles**.\n\n"
            f"• **Email**: {email}\n"
            f"• **Location**: {location}\n"
            f"• **GitHub**: [Harsh324]({github})\n"
            f"• **LinkedIn**: [Profile]({linkedin})\n\n"
            "You can also download his complete PDF on the [Resume](/resume) page."
        )
        sources = ["SiteSettings Schema"]
    else:
        reply = (
            f"{first_name} is a **{settings.title if settings else 'Backend & Cloud Engineer'}** specializing in "
            f"Python, Django, AWS, asynchronous pipelines, and high-performance APIs.\n\n"
            f"Ask me about his platform engineering at SMS DataTech in Tokyo, AWS certifications, "
            f"or explore his [Work Experience](/experience), [Projects](/projects), and [Skills](/skills)."
        )
        sources = ["SiteSettings Schema", "ContentGraph Database"]

    return {
        "reply": reply,
        "mode": "rag-structured",
        "sources": sources,
    }


def stream_ai_assistant_reply(messages_input: Any) -> Generator[str, None, None]:
    """
    Generator yielding Server-Sent Events (SSE) data chunks for real-time token streaming.
    Format of each line: data: {"type": ..., "chunk": ..., ...}\n\n
    """
    settings = SiteSettings.objects.first()
    messages = normalize_messages(messages_input)
    last_user_query = messages[-1]["content"] if messages else ""
    context = build_resume_context()

    gemini_key = getattr(django_settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
    openai_key = getattr(django_settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")

    # 1. Try Gemini Streaming
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Format strictly alternating multi-turn history for Gemini
            contents = [
                {"role": "user", "parts": [f"{SYSTEM_GUARDRAILS}\n\nBACKGROUND CONTEXT:\n{context}\n\nPlease acknowledge your role."]},
                {"role": "model", "parts": ["Understood. I will answer strictly based on Harsh's Career OS context."]},
            ]
            last_role = "model"
            for m in messages[:-1]:
                curr_role = "user" if m["role"] == "user" else "model"
                if curr_role != last_role:
                    contents.append({"role": curr_role, "parts": [m["content"]]})
                    last_role = curr_role
                else:
                    contents[-1]["parts"].append(m["content"])
            
            if last_role == "user":
                contents[-1]["parts"].append(last_user_query)
            else:
                contents.append({"role": "user", "parts": [last_user_query]})

            yield f"data: {json.dumps({'type': 'meta', 'mode': 'llm-gemini', 'sources': ['PostgreSQL ContentGraph', 'Django ORM Services']})}\n\n"

            response = model.generate_content(contents, stream=True)
            full_text = ""
            for chunk in response:
                if chunk.text:
                    full_text += chunk.text
                    yield f"data: {json.dumps({'type': 'chunk', 'chunk': chunk.text})}\n\n"

            actions = extract_action_cards(full_text, settings)
            suggestions = extract_suggestions(full_text)
            yield f"data: {json.dumps({'type': 'done', 'actions': actions, 'suggestions': suggestions})}\n\n"
            return
        except Exception as e:
            logger.warning(f"Gemini Streaming failed, falling back: {e}")

    # 2. Try OpenAI Streaming
    if openai_key:
        try:
            import urllib.request
            openai_messages = [
                {"role": "system", "content": f"{SYSTEM_GUARDRAILS}\n\nBACKGROUND CONTEXT:\n{context}"},
            ]
            for m in messages[-6:]:
                role = "user" if m["role"] == "user" else "assistant"
                openai_messages.append({"role": role, "content": m["content"]})

            payload = {
                "model": "gpt-4o-mini",
                "messages": openai_messages,
                "max_tokens": 450,
                "stream": True,
            }
            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json",
                },
                data=json.dumps(payload).encode("utf-8"),
            )

            yield f"data: {json.dumps({'type': 'meta', 'mode': 'llm-openai', 'sources': ['PostgreSQL ContentGraph', 'Django ORM Services']})}\n\n"

            full_text = ""
            with urllib.request.urlopen(req) as resp:
                for line in resp:
                    line_str = line.decode("utf-8").strip()
                    if line_str.startswith("data: ") and line_str != "data: [DONE]":
                        chunk_data = json.loads(line_str[6:])
                        delta = chunk_data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                        if delta:
                            full_text += delta
                            yield f"data: {json.dumps({'type': 'chunk', 'chunk': delta})}\n\n"

            actions = extract_action_cards(full_text, settings)
            suggestions = extract_suggestions(full_text)
            yield f"data: {json.dumps({'type': 'done', 'actions': actions, 'suggestions': suggestions})}\n\n"
            return
        except Exception as e:
            logger.warning(f"OpenAI Streaming failed, falling back: {e}")

    # 3. Fallback Zero-Cost Structured RAG Streaming
    rag_result = _fallback_rag_response(last_user_query, settings)
    full_text = rag_result["reply"]
    sources = rag_result["sources"]
    mode = rag_result["mode"]

    yield f"data: {json.dumps({'type': 'meta', 'mode': mode, 'sources': sources})}\n\n"

    # Stream words with slight natural typing cadence
    words = full_text.split(" ")
    for idx, word in enumerate(words):
        space = " " if idx < len(words) - 1 else ""
        yield f"data: {json.dumps({'type': 'chunk', 'chunk': word + space})}\n\n"
        time.sleep(0.012)

    actions = extract_action_cards(full_text, settings)
    suggestions = extract_suggestions(full_text)
    yield f"data: {json.dumps({'type': 'done', 'actions': actions, 'suggestions': suggestions})}\n\n"


def get_ai_assistant_reply(messages_input: Any) -> dict[str, Any]:
    """Synchronous / Non-streaming fallback function."""
    settings = SiteSettings.objects.first()
    messages = normalize_messages(messages_input)
    last_user_query = messages[-1]["content"] if messages else ""
    context = build_resume_context()

    gemini_key = getattr(django_settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
    openai_key = getattr(django_settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")

    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            contents = [
                {"role": "user", "parts": [f"{SYSTEM_GUARDRAILS}\n\nBACKGROUND CONTEXT:\n{context}\n\nPlease acknowledge your role."]},
                {"role": "model", "parts": ["Understood. I will answer strictly based on Harsh's Career OS context."]},
            ]
            for m in messages[:-1]:
                role = "user" if m["role"] == "user" else "model"
                contents.append({"role": role, "parts": [m["content"]]})
            contents.append({"role": "user", "parts": [last_user_query]})

            response = model.generate_content(contents)
            reply = response.text
            return {
                "reply": reply,
                "mode": "llm-gemini",
                "sources": ["PostgreSQL ContentGraph", "Django ORM Services"],
                "actions": extract_action_cards(reply, settings),
                "suggestions": extract_suggestions(reply),
            }
        except Exception as e:
            logger.warning(f"Gemini call failed, using fallback RAG: {e}")

    if openai_key:
        try:
            import urllib.request
            openai_messages = [
                {"role": "system", "content": f"{SYSTEM_GUARDRAILS}\n\nBACKGROUND CONTEXT:\n{context}"},
            ]
            for m in messages[-6:]:
                role = "user" if m["role"] == "user" else "assistant"
                openai_messages.append({"role": role, "content": m["content"]})

            payload = {
                "model": "gpt-4o-mini",
                "messages": openai_messages,
                "max_tokens": 450,
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
                    "actions": extract_action_cards(reply, settings),
                    "suggestions": extract_suggestions(reply),
                }
        except Exception as e:
            logger.warning(f"OpenAI call failed, using fallback RAG: {e}")

    rag_result = _fallback_rag_response(last_user_query, settings)
    reply = rag_result["reply"]
    return {
        "reply": reply,
        "mode": rag_result["mode"],
        "sources": rag_result["sources"],
        "actions": extract_action_cards(reply, settings),
        "suggestions": extract_suggestions(reply),
    }


