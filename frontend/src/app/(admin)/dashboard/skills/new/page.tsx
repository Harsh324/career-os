"use client";

import React from "react";
import { SkillEditorForm } from "@/components/skills/SkillEditorForm";

export default function NewSkillPage() {
  return <SkillEditorForm initialData={null} isNew={true} />;
}
