import type { HomepageData, Project } from "../../components/homepage/types";
import { loadQuery } from "./load-query";
import {
  homepageQuery,
  eventsQuery,
  footerQuery,
  infoQuery,
  projectBySlugQuery,
} from "./queries";

export async function getHomepage(preview = false) {
  const { data } = await loadQuery<HomepageData>({
    query: homepageQuery,
    preview,
  });

  return data;
}

export async function getEvents(preview = false) {
  const { data } = await loadQuery<any>({
    query: eventsQuery,
    preview,
  });

  return data;
}

export async function getInfo(preview = false) {
  const { data } = await loadQuery<any>({
    query: infoQuery,
    preview,
  });

  return data;
}

export async function getFooter(preview = false) {
  const { data } = await loadQuery<any>({
    query: footerQuery,
    preview,
  });

  return data;
}

export async function getProjectBySlug(slug: string, preview = false) {
  const { data } = await loadQuery<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    preview,
  });

  return data;
}
