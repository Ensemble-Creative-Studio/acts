import type { SchemaTypeDefinition } from "sanity";
import { blockContentType } from "./blockContent";
import { footerSchemaTypes } from "./footer";
import { homepageSchemaTypes } from "./homepage";
import { eventsSchemaTypes } from "./events";
import { infoSchemaTypes } from "./info";
import { optionType } from "./option";
import { projectSchemaTypes } from "./project";
import colorInput from "./objects/colorInput";
import seoFields from "./objects/seoFields";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    optionType,
    ...footerSchemaTypes,
    ...homepageSchemaTypes,
    ...eventsSchemaTypes,
    ...infoSchemaTypes,
    ...projectSchemaTypes,
    colorInput,
    seoFields,
  ],
};
