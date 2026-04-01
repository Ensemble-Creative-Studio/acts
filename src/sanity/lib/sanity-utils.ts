import type { HomepageData } from "../../components/homepage/types";
import { loadQuery } from "./load-query";
import { homepageQuery, eventsQuery, footerQuery, infoQuery } from "./queries";

export async function getHomepage() {
  const { data } = await loadQuery<HomepageData>({
    query: homepageQuery,
  });

  return data;
}

export async function getEvents() {
  const { data } = await loadQuery<any>({
    query: eventsQuery,
  });

  return data;
}

export async function getInfo() {
  const { data } = await loadQuery<any>({
    query: infoQuery,
  });

  return data;
}

export async function getFooter() {
  const { data } = await loadQuery<any>({
    query: footerQuery,
  });

  return data;
}
