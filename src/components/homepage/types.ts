export type ProjectCredit = {
  _key?: string;
  jobs?: string;
  name?: string;
};

export type ImageAsset = {
  asset?: {
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
  alt?: string;
};

export type ProjectSelectableMedia = {
  mediaType?: "image" | "video";
  image?: ImageAsset;
  video?: {
    asset?: {
      playbackId?: string;
    };
  };
  caption?: string;
};

export type ProjectGalleryFullImageRow = {
  _key?: string;
  _type: "projectGalleryFullImageRow";
  image?: ImageAsset;
  caption?: string;
};

export type ProjectGalleryFullVideoRow = {
  _key?: string;
  _type: "projectGalleryFullVideoRow";
  video?: {
    asset?: {
      playbackId?: string;
    };
  };
  caption?: string;
};

export type ProjectGallerySplitRight = {
  _key?: string;
  _type: "projectGallerySplitRight";
  leftMedia?: ProjectSelectableMedia;
  rightMedia?: ProjectSelectableMedia;
};

export type ProjectGallerySplitLeft = {
  _key?: string;
  _type: "projectGallerySplitLeft";
  leftMedia?: ProjectSelectableMedia;
  rightMedia?: ProjectSelectableMedia;
};

export type ProjectGalleryItem =
  | ProjectGalleryFullImageRow
  | ProjectGalleryFullVideoRow
  | ProjectGallerySplitRight
  | ProjectGallerySplitLeft;

export type Project = {
  _id: string;
  _type: "project";
  name?: string;
  color?: string;
  titleColor?: string;
  credits?: ProjectCredit[];
  mainMedia?: ProjectSelectableMedia;
  gallery?: ProjectGalleryItem[];
};

export type PresentationSlide = {
  _key?: string;
  _type:
    | "homepageGalleryPresentationSlide"
    | "eventsGalleryPresentationSlide";
  color?: string;
  title?: string;
  subtitle?: string;
};

export type GallerySlide = PresentationSlide | Project;

export type HomepageGallery = {
  _key?: string;
  slides: GallerySlide[];
};

export type HomepageData = {
  galleries?: HomepageGallery[];
  description?: string;
};
