import { defineArrayMember, defineField, defineType } from "sanity";

const validateHomepageGallerySlides = (
  value: Array<{ _type?: string }> | undefined,
) => {
  if (!value?.length) {
    return "Add at least the gallery presentation slide.";
  }

  if (value[0]?._type !== "homepageGalleryPresentationSlide") {
    return "The first slide must stay a Gallery presentation slide.";
  }

  return true;
};

const homepageGalleryPresentationSlideType = defineType({
  name: "homepageGalleryPresentationSlide",
  title: "Gallery presentation",
  type: "object",
  fields: [
    defineField({
      name: "color",
      title: "Color",
      type: "colorInput",
      description: "Background color used for this intro slide.",
    }),
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

const homepageGalleryType = defineType({
  name: "homepageGallery",
  title: "Gallery",
  type: "object",
  initialValue: {
    slides: [{ _type: "homepageGalleryPresentationSlide" }],
  },
  fields: [
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      description:
        "Each gallery starts with a presentation slide, then you can add as many projects as needed.",
      of: [
        defineArrayMember({ type: "homepageGalleryPresentationSlide" }),
        defineArrayMember({
          type: "reference",
          title: "Project",
          to: [{ type: "project" }],
        }),
      ],
      validation: (Rule) =>
        Rule.required().custom(validateHomepageGallerySlides),
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

export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "galleries", title: "Galleries" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Main homepage title.",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "content",
      description: "Homepage introduction in Portable Text.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galleries",
      title: "Galleries",
      type: "array",
      group: "galleries",
      description:
        "Add one or more homepage galleries. Each new gallery is prefilled with a presentation slide.",
      of: [defineArrayMember({ type: "homepageGallery" })],
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
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Homepage",
        subtitle: "Homepage content and project galleries",
      };
    },
  },
});

export const homepageSchemaTypes = [
  homepageGalleryPresentationSlideType,
  homepageGalleryType,
  homepageType,
];
