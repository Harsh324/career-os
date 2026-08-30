import type { Metadata } from "next";
import { fetchExperiences, fetchSkills, fetchCertifications, fetchEducation, fetchSiteSettings } from "@/lib/api/services";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/site";
import { ResumeViewSwitcher } from "@/components/resume/ResumeViewSwitcher";
import type { Experience, Certification, Education } from "@/lib/api/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae",
  description: "Official resume of Harsh Tripathi, Software Engineer (Backend and Cloud) in Tokyo, Japan. View online or download PDF.",
};

export default async function ResumePage() {
  let meta = DEFAULT_SITE_SETTINGS;
  let experiences: Experience[] = [];
  let certs: Certification[] = [];
  let education: Education[] = [];

  try {
    const [fetchedSettings, fetchedExp, fetchedSkills, fetchedCerts, fetchedEdu] =
      await Promise.all([
        fetchSiteSettings().catch(() => null),
        fetchExperiences().catch(() => []),
        fetchSkills().catch(() => []),
        fetchCertifications().catch(() => []),
        fetchEducation().catch(() => []),
      ]);

    if (fetchedSettings) meta = { ...meta, ...fetchedSettings };
    experiences = Array.isArray(fetchedExp) ? fetchedExp : [];
    certs = Array.isArray(fetchedCerts) ? fetchedCerts : [];
    education = Array.isArray(fetchedEdu) ? fetchedEdu : [];
  } catch (err) {
    experiences = [];
    certs = [];
    education = [];
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <ResumeViewSwitcher
        meta={meta}
        experiences={experiences}
        certs={certs}
        education={education}
      />
    </div>
  );
}
