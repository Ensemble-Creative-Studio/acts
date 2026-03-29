import { defineArrayMember, defineField, defineType } from "sanity";

const validateSelectableMedia = (
  value:
    | {
        mediaType?: "image" | "video";
        image?: { asset?: unknown };
        video?: { asset?: { _ref?: string } };
      }
    | undefined,
) => {
  if (!value?.mediaType) {
    return "Choose whether this media item is an image or a video.";
  }

  if (value.mediaType === "image" && !value.image?.asset) {
    return "Upload an image for this media item.";
  }

  if (value.mediaType === "video" && !value.video?.asset?._ref) {
    return "Select a Mux video for this media item.";
  }

  return true;
};

const creditType = defineType({
  name: "projectCredit",
  title: "Credit",
  type: "object",
  fields: [
    defineField({
      name: "jobs",
      title: "Jobs",
      type: "string",
      description: "Role, discipline, or responsibility for this person.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "jobs",
    },
  },
});

const selectableMediaType = defineType({
  name: "projectSelectableMedia",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.mediaType !== "image",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility.",
        }),
      ],
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "mux.video",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional internal note or frontend caption.",
    }),
  ],
  preview: {
    select: {
      mediaType: "mediaType",
      image: "image",
      caption: "caption",
    },
    prepare({ mediaType, image, caption }) {
      const typeLabel = mediaType === "video" ? "Video" : "Image";
      return {
        title: caption || typeLabel,
        subtitle: mediaType === "video" ? "Mux video" : "Image asset",
        media: image,
      };
    },
  },
  validation: (Rule) => Rule.custom(validateSelectableMedia),
});

const galleryFullImageRowType = defineType({
  name: "projectGalleryFullImageRow",
  title: "Full width image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional internal note or frontend caption.",
    }),
  ],
  preview: {
    select: {
      media: "image",
      caption: "caption",
    },
    prepare({ media, caption }) {
      return {
        title: "Full width image",
        subtitle: caption || "One large image on a single row",
        media,
      };
    },
  },
});

const galleryFullVideoRowType = defineType({
  name: "projectGalleryFullVideoRow",
  title: "Full width video",
  type: "object",
  fields: [
    defineField({
      name: "video",
      title: "Video",
      type: "mux.video",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional internal note or frontend caption.",
    }),
  ],
  preview: {
    select: {
      caption: "caption",
    },
    prepare({ caption }) {
      return {
        title: "Full width video",
        subtitle: caption || "One large video on a single row",
      };
    },
  },
});

const gallerySplitRightType = defineType({
  name: "projectGallerySplitRight",
  title: "Large media right / small media left",
  type: "object",
  fields: [
    defineField({
      name: "leftMedia",
      title: "Small media left",
      type: "projectSelectableMedia",
      description: "Smaller media displayed on the left side of the row.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightMedia",
      title: "Large media right",
      type: "projectSelectableMedia",
      description: "Larger media displayed on the right side of the row.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Large media right / small media left",
        subtitle: "Two media items on one row",
      };
    },
  },
});

const gallerySplitLeftType = defineType({
  name: "projectGallerySplitLeft",
  title: "Large media left / small media right",
  type: "object",
  fields: [
    defineField({
      name: "leftMedia",
      title: "Large media left",
      type: "projectSelectableMedia",
      description: "Larger media displayed on the left side of the row.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rightMedia",
      title: "Small media right",
      type: "projectSelectableMedia",
      description: "Smaller media displayed on the right side of the row.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Large media left / small media right",
        subtitle: "Two media items on one row",
      };
    },
  },
});

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "hero", title: "Hero media" },
    { name: "gallery", title: "Gallery" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      description: "Project title shown in the studio and on the site.",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "colorInput",
      group: "content",
      description: "Color used for the project.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      group: "content",
      description:
        "Add as many credits as needed. Each entry contains a job and a name.",
      of: [defineArrayMember({ type: "projectCredit" })],
    }),
    defineField({
      name: "mainMedia",
      title: "Main media",
      type: "projectSelectableMedia",
      group: "hero",
      description:
        "Primary media for the project hero. Choose either an image or a Mux video.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "gallery",
      description:
        "Build the gallery row by row. Each row lets you choose one of the four supported layouts.",
      of: [
        defineArrayMember({ type: "projectGalleryFullImageRow" }),
        defineArrayMember({ type: "projectGalleryFullVideoRow" }),
        defineArrayMember({ type: "projectGallerySplitRight" }),
        defineArrayMember({ type: "projectGallerySplitLeft" }),
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: "list",
            },
          ],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "mainMedia.image",
      mediaType: "mainMedia.mediaType",
    },
    prepare({ title, media, mediaType }) {
      return {
        title,
        subtitle:
          mediaType === "video" ? "Main media: video" : "Main media: image",
        media,
      };
    },
  },
});

export const projectSchemaTypes = [
  creditType,
  selectableMediaType,
  galleryFullImageRowType,
  galleryFullVideoRowType,
  gallerySplitRightType,
  gallerySplitLeftType,
  projectType,
];
