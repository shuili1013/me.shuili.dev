import type { SchemaTypeDefinition } from "sanity";
import { localeString, localeText } from "./localeString";
import { localePortableText, modelBlock } from "./modelBlock";
import { profile } from "./profile";
import { post } from "./post";

export const schemaTypes: SchemaTypeDefinition[] = [
  localeString,
  localeText,
  localePortableText,
  modelBlock,
  profile,
  post,
];
