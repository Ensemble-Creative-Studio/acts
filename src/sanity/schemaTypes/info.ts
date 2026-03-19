import { defineField, defineType } from "sanity";

export const infoType = defineType({
  name: "info",
  title: "Info",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Portable Text",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactTitle",
      title: "Contact Title",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "adresse",
      title: "Adresse",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "pageTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Info",
        subtitle: "Info page content",
      };
    },
  },
});

export const infoSchemaTypes = [infoType];