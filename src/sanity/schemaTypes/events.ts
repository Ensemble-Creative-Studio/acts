import { defineArrayMember, defineField, defineType } from "sanity";

const validateEventsGallerySlides = (
  value: Array<{ _type?: string }> | undefined,
) => {
  if (!value?.length) {
    return "Add at least the gallery presentation slide.";
  }

  if (value[0]?._type !== "eventsGalleryPresentationSlide") {
    return "The first slide must stay a Gallery presentation slide.";
  }

  return true;
};

const eventsGalleryPresentationSlideType = defineType({
  name: "eventsGalleryPresentationSlide",
  title: "Gallery presentation",
  type: "object",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional heading shown at the start of this gallery.",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description:
        "Optional short supporting text for the gallery introduction.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Gallery presentation",
        subtitle: subtitle || "Intro slide",
      };
    },
  },
});

const eventsGalleryType = defineType({
  name: "eventsGallery",
  title: "Gallery",
  type: "object",
  initialValue: {
    slides: [{ _type: "eventsGalleryPresentationSlide" }],
  },
  fields: [
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      description:
        "Each gallery starts with a presentation slide, then you can add as many projects as needed.",
      of: [
        defineArrayMember({ type: "eventsGalleryPresentationSlide" }),
        defineArrayMember({
          type: "reference",
          title: "Project",
          to: [{ type: "project" }],
        }),
      ],
      validation: (Rule) => Rule.required().custom(validateEventsGallerySlides),
      options: {
        insertMenu: {
          views: [{ name: "list" }],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "slides.0.title",
      subtitle: "slides.0.subtitle",
      projectCount: "slides",
    },
    prepare({ title, subtitle, projectCount }) {
      const projects =
        Array.isArray(projectCount) && projectCount.length > 0
          ? Math.max(projectCount.length - 1, 0)
          : 0;

      return {
        title: title || "Gallery",
        subtitle:
          subtitle || `${projects} project${projects === 1 ? "" : "s"} linked`,
      };
    },
  },
});

export const eventsType = defineType({
  name: "events",
  title: "Events",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "galleries", title: "Galleries" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "introduction",
      title: "Texte d'introduction",
      type: "blockContent",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galleries",
      title: "Galleries",
      type: "array",
      group: "galleries",
      description:
        "Add one or more event galleries. Each new gallery is prefilled with a presentation slide.",
      of: [defineArrayMember({ type: "eventsGallery" })],
      options: {
        insertMenu: {
          views: [{ name: "list" }],
        },
      },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Events",
        subtitle: "Events content and galleries",
      };
    },
  },
});

export const eventsSchemaTypes = [
  eventsGalleryPresentationSlideType,
  eventsGalleryType,
  eventsType,
];
