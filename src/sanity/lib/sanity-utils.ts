import type { HomepageData } from "../../components/homepage/types";
import { loadQuery } from "./load-query";
import { homepageQuery } from "./queries";

export async function getHomepage() {
  const { data } = await loadQuery<HomepageData>({
    query: homepageQuery,
  });

  return data;
}
