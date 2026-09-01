import type { Metadata } from "next";
import { fetchSkills, fetchCertifications } from "@/lib/api/services";
import { SkillMatrixView } from "@/components/skills/SkillMatrixView";
import type { Skill, Certification } from "@/lib/api/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Technical Skills & Stack | Harsh Tripathi",
  description: "Core technical competencies in Python, Django, Celery, AWS, Docker, databases, and modern software engineering tools.",
};

export default async function SkillsPage() {
  let skills: Skill[] = [];
  let certs: Certification[] = [];

  try {
    const [fetchedSkills, fetchedCerts] = await Promise.all([
      fetchSkills().catch(() => []),
      fetchCertifications().catch(() => []),
    ]);
    skills = Array.isArray(fetchedSkills) ? fetchedSkills : [];
    certs = Array.isArray(fetchedCerts) ? fetchedCerts : [];
  } catch {
    skills = [];
    certs = [];
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
      <SkillMatrixView skills={skills} certs={certs} isDraftPreview={false} />
    </div>
  );
}

