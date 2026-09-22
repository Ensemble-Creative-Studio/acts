import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.preview = context.cookies.get("sanity-preview")?.value === "1";
  return next();
});
