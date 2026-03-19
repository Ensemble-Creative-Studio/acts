import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["homepage", "events", "info"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(
          S.document()
            .schemaType("homepage")
            .documentId("homepage"),
        ),
      S.listItem()
        .title("Events")
        .id("events")
        .child(
          S.document()
            .schemaType("events")
            .documentId("events"),
        ),
      S.listItem()
        .title("Info")
        .id("info")
        .child(
          S.document()
            .schemaType("info")
            .documentId("info"),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId() ?? ""),
      ),
    ]);