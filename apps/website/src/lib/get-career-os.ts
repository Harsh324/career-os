import path from "node:path";
import process from "node:process";
import { parseContent } from "@career-os/content-parser";
import { createCareerOS, type CareerOS } from "@career-os/sdk";

let cachedSDK: CareerOS | null = null;

/**
 * Server-side helper to fetch the cached CareerOS SDK client.
 * Calls parseContent at build-time to produce the ContentGraph,
 * then instantiates the read-only CareerOS SDK (P6).
 */
export async function getCareerSDK(): Promise<CareerOS> {
  if (!cachedSDK) {
    const rawDir = path.resolve(
      process.cwd(),
      process.cwd().includes("apps/website") ? "../../content/raw" : "content/raw"
    );
    const graph = await parseContent(rawDir);
    cachedSDK = createCareerOS(graph);
  }
  return cachedSDK;
}
