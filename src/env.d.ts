/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly SANITY_REVALIDATE_SECRET?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly PUBLIC_SANITY_PREVIEW_SECRET?: string;
}

declare namespace App {
  interface Locals {
    preview: boolean;
  }
}
