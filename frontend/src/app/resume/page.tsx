import type { Metadata } from "next";
import { fetchExperiences, fetchSkills, fetchCertifications, fetchEducation, fetchSiteSettings } from "@/lib/api/services";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/site";
import { ResumeViewSwitcher } from "@/components/resume/ResumeViewSwitcher";

export const metadata: Metadata = {
  title: "Resume & Curriculum Vitae",
  description: "Official resume of Harsh Tripathi, Software Engineer (Backend and Cloud) in Tokyo, Japan. View online or download PDF.",
};

export default async function ResumePage() {
  let meta = DEFAULT_SITE_SETTINGS;
  let experiences: any[] = [];
  let certs: any[] = [];
  let education: any[] = [];

  try {
    const [fetchedSettings, fetchedExp, fetchedSkills, fetchedCerts, fetchedEdu] =
      await Promise.all([
        fetchSiteSettings(),
        fetchExperiences(),
        fetchSkills(),
        fetchCertifications(),
        fetchEducation(),
      ]);

    if (fetchedSettings) meta = { ...meta, ...fetchedSettings };
    experiences = fetchedExp;
    certs = fetchedCerts;
    education = fetchedEdu;
  } catch (err) {}

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10">
      <ResumeViewSwitcher
        meta={meta}
        experiences={experiences}
        certs={certs}
        education={education}
      />
    </div>
  );
}
