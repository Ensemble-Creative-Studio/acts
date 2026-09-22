import { defineField, defineType } from "sanity";

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  groups: [{ name: "content", title: "Content" }],
  fields: [
    defineField({
      name: "projectsLabel",
      title: "Projects link label",
      type: "string",
      group: "content",
      description: "Text shown in the header for the projects/homepage link.",
      initialValue: "Works",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "eventsLabel",
      title: "Events link label",
      type: "string",
      group: "content",
      description: "Text shown in the header for the events link.",
      initialValue: "Events",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "infoLabel",
      title: "Info link label",
      type: "string",
      group: "content",
      description: "Text shown in the header for the info link.",
      initialValue: "Info",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Navigation",
        subtitle: "Header menu labels",
      };
    },
  },
});

export const navigationSchemaTypes = [navigationType];
