const DEFAULT_PAGE_BACKGROUND = "#EDDDD9";

export function initPageBackgroundColorSync(root: ParentNode = document) {
  const mainElement = root.querySelector("main");
  const pageBackgroundSections = Array.from(
    root.querySelectorAll("[data-page-background]"),
  ) as HTMLElement[];

  const setPageBackground = (color?: string) => {
    document.documentElement.style.setProperty(
      "--page-background",
      color || DEFAULT_PAGE_BACKGROUND,
    );
  };

  const syncPageBackground = () => {
    if (!pageBackgroundSections.length) {
      setPageBackground(DEFAULT_PAGE_BACKGROUND);
      return;
    }

    const viewportCenter = window.innerHeight / 2;
    const activeSection = pageBackgroundSections.reduce<HTMLElement | null>(
      (bestSection, section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

        if (!isVisible) {
          return bestSection;
        }

        if (!bestSection) {
          return section;
        }

        const bestRect = bestSection.getBoundingClientRect();
        const bestCenter = bestRect.top + bestRect.height / 2;

        return Math.abs(sectionCenter - viewportCenter) <
          Math.abs(bestCenter - viewportCenter)
          ? section
          : bestSection;
      },
      null,
    );

    setPageBackground(activeSection?.dataset.pageBackground);
  };

  mainElement?.addEventListener("scroll", syncPageBackground, { passive: true });
  window.addEventListener("resize", syncPageBackground);
  syncPageBackground();
}
