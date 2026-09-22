import { type QueryParams } from "sanity";
import { sanityClient } from "sanity:client";
import { getPreviewClient } from "./preview-client";

export async function loadQuery<QueryResponse>({
  query,
  params,
  preview = false,
}: {
  query: string;
  params?: QueryParams;
  preview?: boolean;
}) {
  const client = (preview && getPreviewClient()) || sanityClient;

  const { result } = await client.fetch<QueryResponse>(
    query,
    params ?? {},
    { filterResponse: false },
  );

  return {
    data: result,
  };
}
