import { defineField, defineType } from "sanity";

export const footerType = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  groups: [{ name: "content", title: "Content" }],
  fields: [
    defineField({
      name: "phrase",
      title: "Phrase",
      type: "string",
      group: "content",
      description:
        "Centered sentence shown in the footer slide. Use [[logo]] where the ACTS logo should appear.",
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
  preview: {
    select: {
      title: "phrase",
    },
    prepare({ title }) {
      return {
        title: title || "Footer",
        subtitle: "Footer sentence",
      };
    },
  },
});

export const footerSchemaTypes = [footerType];
