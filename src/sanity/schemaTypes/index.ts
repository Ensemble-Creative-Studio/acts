import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContent";
import { homepageSchemaTypes } from "./homepage";
import { optionType } from "./option";
import { projectSchemaTypes } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, optionType, ...homepageSchemaTypes, ...projectSchemaTypes],
};
