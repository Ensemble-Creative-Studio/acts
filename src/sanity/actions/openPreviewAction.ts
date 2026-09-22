import type { DocumentActionComponent, DocumentActionProps } from "sanity";

type PreviewDoc = { slug?: { current?: string } } | null | undefined;

const STATIC_PREVIEW_PATHS: Record<string, string> = {
  homepage: "/",
  events: "/events",
  info: "/info",
  navigation: "/",
};

function resolvePreviewPath(props: DocumentActionProps): string | null {
  if (props.type === "project") {
    const doc = (props.draft ?? props.published) as PreviewDoc;
    const slug = doc?.slug?.current;
    return slug ? `/projects/${slug}` : null;
  }

  return STATIC_PREVIEW_PATHS[props.type] ?? null;
}

export function createOpenPreviewAction(
  originalActions: DocumentActionComponent[],
) {
  const openPreview: DocumentActionComponent = (props: DocumentActionProps) => {
    if (!(props.type in STATIC_PREVIEW_PATHS) && props.type !== "project") {
      return null;
    }

    const path = resolvePreviewPath(props);

    if (!path) {
      return {
        label: "Aperçu sur le site",
        disabled: "Ajoute d'abord un slug à ce projet.",
        onHandle: () => {},
      };
    }

    return {
      label: "Aperçu sur le site",
      onHandle: () => {
        const secret = import.meta.env.PUBLIC_SANITY_PREVIEW_SECRET as
          | string
          | undefined;

        let target = path;

        if (secret) {
          const params = new URLSearchParams({ secret, redirect: path });
          target = `/api/preview/enable?${params.toString()}`;
        }

        window.open(target, "_blank", "noopener,noreferrer");
        props.onComplete();
      },
    };
  };

  return [...originalActions, openPreview];
}
