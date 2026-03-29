import { defineField, defineType } from "sanity";

export const optionType = defineType({
  name: "option",
  title: "Option",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      group: "identity",
      description: "Default title used across the site and in SEO tags.",
      validation: (Rule) => Rule.required().min(2).max(70),
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "file",
      group: "identity",
      description: "Upload a .png, .svg, or .ico file used as the browser icon.",
      options: {
        accept: ".png,.svg,.ico",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Default SEO description for the site. Keep it clear and plain text.",
      validation: (Rule) => Rule.required().min(50).max(160),
    }),
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "metaDescription",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Option",
        subtitle: subtitle || "Global SEO settings",
      };
    },
  },
});
