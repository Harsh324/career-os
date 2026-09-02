import re
from typing import Any, Dict, List, Optional

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.timeline.models import TimelineEvent

MONTH_MAP = {
    "jan": "01",
    "feb": "02",
    "mar": "03",
    "apr": "04",
    "may": "05",
    "jun": "06",
    "jul": "07",
    "aug": "08",
    "sep": "09",
    "oct": "10",
    "nov": "11",
    "dec": "12",
}

MONTH_NAME_MAP = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
}


def derive_sort_date(date_str: Optional[str]) -> str:
    """
    Normalizes human or ISO date strings into a sortable YYYY-MM-DD or YYYY-MM string.
    Examples:
      '2025-08-19' -> '2025-08-19'
      'Oct 2024' -> '2024-10'
      'Jul 2023 – May 2024' -> '2023-07'
      'Dec 2020' -> '2020-12'
      '2024' -> '2024-01'
    """
    if not date_str:
        return "0000-00"

    clean = str(date_str).strip()

    # If range like "Jul 2023 – May 2024", take first part for sorting
    if "–" in clean:
        clean = clean.split("–")[0].strip()
    elif "-" in clean and not re.match(r"^\d{4}-\d{2}", clean):
        clean = clean.split("-")[0].strip()

    # Check ISO format YYYY-MM-DD or YYYY-MM
    if re.match(r"^\d{4}-\d{2}-\d{2}$", clean):
        return clean
    if re.match(r"^\d{4}-\d{2}$", clean):
        return f"{clean}-01"

    # Match Month Year (e.g., 'Oct 2024' or 'August 2025')
    tokens = clean.lower().replace(",", "").split()
    if len(tokens) >= 2:
        m_str = tokens[0][:3]
        y_str = tokens[1]
        if m_str in MONTH_MAP and y_str.isdigit() and len(y_str) == 4:
            return f"{y_str}-{MONTH_MAP[m_str]}-01"
        # Check reverse: '2024 Oct'
        m_str2 = tokens[1][:3]
        y_str2 = tokens[0]
        if m_str2 in MONTH_MAP and y_str2.isdigit() and len(y_str2) == 4:
            return f"{y_str2}-{MONTH_MAP[m_str2]}-01"

    # Match 4 digit year
    year_match = re.search(r"\b(19\d\d|20\d\d)\b", clean)
    if year_match:
        return f"{year_match.group(1)}-01-01"

    return "0000-00-00"


def format_display_date(date_str: Optional[str]) -> str:
    """
    Formats dates like '2025-08-19' into 'Aug 2025', while preserving existing formatted labels.
    """
    if not date_str:
        return ""
    clean = str(date_str).strip()
    # If YYYY-MM-DD
    if re.match(r"^\d{4}-\d{2}-\d{2}$", clean):
        parts = clean.split("-")
        month_abbr = MONTH_NAME_MAP.get(parts[1], parts[1])
        return f"{month_abbr} {parts[0]}"
    return clean


def build_timeline_projection(
    is_staff: bool = False,
    category: Optional[str] = None,
    is_milestone: Optional[bool] = None,
    source_type: Optional[str] = None,
    published: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    """
    Aggregates canonical entities (Experience, Education, Certification)
    and persisted ManualMilestone (TimelineEvent) records into a unified timeline presentation.
    """
    entries: List[Dict[str, Any]] = []

    # 1. Experiences
    if source_type in [None, "", "all", "experience"]:
        exp_qs = Experience.objects.select_related("company").all()
        if not is_staff:
            exp_qs = exp_qs.filter(is_published=True)
        elif published is not None:
            exp_qs = exp_qs.filter(is_published=published)

        for exp in exp_qs:
            company_name = exp.company.name if exp.company else "Independent"
            subtitle = f"{company_name} ({exp.location})" if exp.location else company_name
            end_label = "Present" if exp.current_position else (exp.end_date or "")
            date_label = f"{exp.start_date} – {end_label}" if end_label else exp.start_date
            sort_val = exp.start_year_month or derive_sort_date(exp.start_date)

            entry = {
                "id": f"exp-{exp.id}",
                "slug": f"exp-{exp.slug}",
                "source_type": "experience",
                "source_id": exp.id,
                "source_slug": exp.slug,
                "title": exp.title,
                "subtitle": subtitle,
                "description": exp.summary or exp.mission or "",
                "date": date_label,
                "date_sort": sort_val,
                "category": "Career",
                "icon": "Briefcase",
                "link": "",
                "is_milestone": bool(exp.featured or exp.current_position),
                "is_published": exp.is_published,
                "order": 10,
                "target_roles": exp.target_roles if is_staff else [],
                "internal_notes": exp.internal_notes if is_staff else "",
                "created_at": exp.created_at.isoformat() if exp.created_at else None,
                "updated_at": exp.updated_at.isoformat() if exp.updated_at else None,
            }
            entries.append(entry)

    # 2. Education
    if source_type in [None, "", "all", "education"]:
        edu_qs = Education.objects.all()
        if not is_staff:
            edu_qs = edu_qs.filter(is_published=True)
        elif published is not None:
            edu_qs = edu_qs.filter(is_published=published)

        for edu in edu_qs:
            subtitle = f"{edu.institution} ({edu.location})" if edu.location else edu.institution
            date_label = f"{edu.start_date} – {edu.end_date}" if edu.end_date else edu.start_date
            sort_val = derive_sort_date(edu.end_date or edu.start_date)
            desc = edu.description
            if not desc and edu.achievements:
                desc = edu.achievements[0]

            entry = {
                "id": f"edu-{edu.id}",
                "slug": f"edu-{edu.slug}",
                "source_type": "education",
                "source_id": edu.id,
                "source_slug": edu.slug,
                "title": edu.degree,
                "subtitle": subtitle,
                "description": desc or "",
                "date": date_label,
                "date_sort": sort_val,
                "category": "Education",
                "icon": "GraduationCap",
                "link": "",
                "is_milestone": bool(edu.is_featured or True),
                "is_published": edu.is_published,
                "order": edu.order or 20,
                "target_roles": edu.target_roles if is_staff else [],
                "internal_notes": edu.internal_notes if is_staff else "",
                "created_at": edu.created_at.isoformat() if edu.created_at else None,
                "updated_at": edu.updated_at.isoformat() if edu.updated_at else None,
            }
            entries.append(entry)

    # 3. Certifications
    if source_type in [None, "", "all", "certification"]:
        cert_qs = Certification.objects.all()
        if not is_staff:
            cert_qs = cert_qs.filter(is_published=True)
        elif published is not None:
            cert_qs = cert_qs.filter(is_published=published)

        for cert in cert_qs:
            date_label = format_display_date(cert.issue_date)
            sort_val = derive_sort_date(cert.issue_date)

            entry = {
                "id": f"cert-{cert.id}",
                "slug": f"cert-{cert.slug}",
                "source_type": "certification",
                "source_id": cert.id,
                "source_slug": cert.slug,
                "title": cert.name,
                "subtitle": cert.issuer,
                "description": cert.description or "",
                "date": date_label,
                "date_sort": sort_val,
                "category": "Certification",
                "icon": "Award",
                "link": cert.credential_url or "",
                "is_milestone": bool(cert.is_featured or True),
                "is_published": cert.is_published,
                "order": cert.order or 30,
                "target_roles": cert.target_roles if is_staff else [],
                "internal_notes": cert.internal_notes if is_staff else "",
                "created_at": cert.created_at.isoformat() if cert.created_at else None,
                "updated_at": cert.updated_at.isoformat() if cert.updated_at else None,
            }
            entries.append(entry)

    # 4. Manual Milestones (persisted TimelineEvent)
    if source_type in [None, "", "all", "manual_milestone"]:
        te_qs = TimelineEvent.objects.all()
        if not is_staff:
            te_qs = te_qs.filter(is_published=True)
        elif published is not None:
            te_qs = te_qs.filter(is_published=published)

        for te in te_qs:
            entry = {
                "id": f"milestone-{te.id}",
                "slug": te.slug,
                "source_type": "manual_milestone",
                "source_id": te.id,
                "source_slug": te.slug,
                "title": te.title,
                "subtitle": te.subtitle or "",
                "description": te.description or "",
                "date": te.date,
                "date_sort": derive_sort_date(te.date),
                "category": te.category or "Milestone",
                "icon": te.icon or "Milestone",
                "link": te.link or "",
                "is_milestone": te.is_milestone,
                "is_published": te.is_published,
                "order": te.order or 50,
                "target_roles": te.target_roles if is_staff else [],
                "internal_notes": te.internal_notes if is_staff else "",
                "created_at": te.created_at.isoformat() if te.created_at else None,
                "updated_at": te.updated_at.isoformat() if te.updated_at else None,
            }
            entries.append(entry)

    # Apply category filtering
    if category and category.lower() != "all":
        entries = [e for e in entries if e["category"].lower() == category.lower()]

    # Apply is_milestone filtering
    if is_milestone is not None:
        entries = [e for e in entries if e["is_milestone"] is is_milestone]

    # Sort deterministically:
    # 1. Reverse Chronological by date_sort
    # 2. Then secondary by order
    entries.sort(key=lambda x: (x.get("date_sort") or "0000-00-00", -(x.get("order") or 0)), reverse=True)

    # Remove internal_notes and target_roles keys entirely if non-staff for security
    if not is_staff:
        for e in entries:
            e.pop("internal_notes", None)
            e.pop("target_roles", None)

    return entries
