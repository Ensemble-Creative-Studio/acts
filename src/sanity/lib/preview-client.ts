import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | null = null;

export function getPreviewClient(): SanityClient | null {
  const token = import.meta.env.SANITY_API_READ_TOKEN;

  if (!token) {
    return null;
  }

  if (!client) {
    client = createClient({
      projectId: "h1krgjqa",
      dataset: "production",
      apiVersion: "2026-03-15",
      useCdn: false,
      perspective: "drafts",
      token,
    });
  }

  return client;
}
