"use client";

import React from "react";
import { ProjectEditorForm } from "@/components/project/ProjectEditorForm";

export default function NewProjectPage() {
  return <ProjectEditorForm initialProject={null} isNew={true} />;
}
