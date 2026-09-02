"use client";

import React from "react";
import type { TimelineEvent } from "@/lib/api/types";
import { CareerTimelineView } from "./CareerTimelineView";

interface TimelineFilterProps {
  timeline: TimelineEvent[];
}

export function TimelineFilter({ timeline }: TimelineFilterProps) {
  return <CareerTimelineView timeline={timeline} isDraftPreview={false} />;
}
