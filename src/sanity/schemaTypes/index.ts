import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContent";
import { homepageSchemaTypes } from "./homepage";
import { eventsSchemaTypes } from "./events";
import { infoSchemaTypes } from "./info";
import { optionType } from "./option";
import { projectSchemaTypes } from "./project";
import colorInput from "./objects/colorInput";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    optionType,
    ...homepageSchemaTypes,
    ...eventsSchemaTypes,
    ...infoSchemaTypes,
    ...projectSchemaTypes,
    colorInput,
  ],
};