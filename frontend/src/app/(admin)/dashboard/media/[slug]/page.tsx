"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import type { MediaAsset } from "@/lib/api/types";
import { getAdminMediaAssetBySlug } from "@/lib/api/admin-client";
import { MediaEditorForm } from "@/components/media/MediaEditorForm";

export default function EditMediaAssetPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAsset() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await getAdminMediaAssetBySlug(slug);
        setAsset(data);
      } catch (err: any) {
        setError(err.message || "Failed to load media asset record.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAsset();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs font-mono text-muted-foreground">
          Loading Media Asset Record...
        </p>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error || "Media asset record not found."}</span>
      </div>
    );
  }

  return <MediaEditorForm initialAsset={asset} isNew={false} />;
}
