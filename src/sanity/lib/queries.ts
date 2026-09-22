const projectMediaFragment = `
  mediaType,
  caption,
  image{
    asset->{
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    },
    alt
  },
  video{
    asset->{
      playbackId
    }
  }
`;

const projectFieldsFragment = `
  _id,
  _type,
  name,
  slug,
  color,
  titleColor,
  credits[]{
    _key,
    jobs,
    name
  },
  mainMedia{
    ${projectMediaFragment}
  },
  gallery[]{
    ...,
    image{
      asset->{
        url,
        metadata{
          dimensions{
            width,
            height
          }
        }
      },
      alt
    },
    leftMedia{
      ${projectMediaFragment}
    },
    rightMedia{
      ${projectMediaFragment}
    },
    video{
      asset->{
        playbackId
      }
    }
  }
`;

export const homepageQuery = `*[_type == "homepage" && _id == "homepage"][0]{
  seo {
    seoTitle,
    seoDescription,
    "seoImage": seoImage.asset->url
  },
  description,
  galleries[]{
    _key,
    slides[]{
      ...,
      _type == "reference" => @->{
        ${projectFieldsFragment}
      }
    }
  }
}`;

export const eventsQuery = `*[_type == "events" && _id == "events"][0]{
  seo {
    seoTitle,
    seoDescription,
    "seoImage": seoImage.asset->url
  },
  introduction,
  galleries[]{
    _key,
    slides[]{
      ...,
      _type == "reference" => @->{
        ${projectFieldsFragment}
      }
    }
  }
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  ${projectFieldsFragment}
}`;

export const infoQuery = `*[_type == "info" && _id == "info"][0]{
  seo {
    seoTitle,
    seoDescription,
    "seoImage": seoImage.asset->url
  },
  pageTitle,
  content,
  contactTitle,
  email,
  adresse,
  instagram
}`;

export const footerQuery = `*[_type == "footer" && _id == "footer"][0]{
  phrase
}`;

export const navigationQuery = `*[_type == "navigation" && _id == "navigation"][0]{
  projectsLabel,
  eventsLabel,
  infoLabel
}`;
