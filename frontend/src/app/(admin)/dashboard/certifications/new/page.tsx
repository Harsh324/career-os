"use client";

import React from "react";
import { CertificationEditorForm } from "@/components/certifications/CertificationEditorForm";

export default function NewCertificationPage() {
  return <CertificationEditorForm isNew={true} />;
}
