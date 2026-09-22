export function initProjectCardInteractions() {
  const mobileGalleryMediaQuery = window.matchMedia("(max-width: 767px)");

  const getIsMobileGallery = () => mobileGalleryMediaQuery.matches;

  const getGalleryPanels = (card: HTMLElement) =>
    Array.from(card.querySelectorAll("[data-gallery-panel]")) as HTMLElement[];

  const getStateAttribute = (isMobile: boolean) =>
    isMobile ? "galleryMobileState" : "galleryDesktopState";

  const getMaxState = (card: HTMLElement, isMobile: boolean) =>
    Number(isMobile ? card.dataset.maxStateMobile || "1" : card.dataset.maxStateDesktop || "1");

  const updateProjectCard = (card: HTMLElement, isMobile = getIsMobileGallery()) => {
    const state = Number(card.dataset.state || "0");
    const galleryPanels = getGalleryPanels(card);
    const stateAttribute = getStateAttribute(isMobile);
    const progress = card.querySelector("[data-gallery-progress]");
    const mediaCounter = card.querySelector("[data-media-counter]");
    const mainMedia = card.querySelector("[data-main-media]") as HTMLElement | null;
    const projectTitle = card.querySelector("[data-project-title]") as HTMLElement | null;

    galleryPanels.forEach((panel) => {
      panel.dataset.visible = panel.dataset[stateAttribute] === String(state) ? "true" : "false";
    });

    const isIntroVisible = state <= 1;
    if (mainMedia) {
      mainMedia.dataset.visible = isIntroVisible ? "true" : "false";
    }

    if (projectTitle) {
      projectTitle.dataset.visible = state === 0 ? "true" : "false";
    }

    if (mediaCounter) {
      const mediaTotal = getMaxState(card, isMobile);
      const mediaIndex = Math.min(Math.max(state, 1), mediaTotal);
      mediaCounter.textContent = `${mediaIndex}/${mediaTotal}`;
    }

    if (progress) {
      const galleryIndex = Math.max(state - 1, 1);
      const galleryTotal = Math.max(getMaxState(card, isMobile) - 1, 1);
      progress.textContent =
        state >= 2 ? `Gallery ${Math.min(galleryIndex, galleryTotal)}/${galleryTotal}` : "Click to reveal";
    }
  };

  const advanceProjectCard = (card: HTMLElement) => {
    const currentState = Number(card.dataset.state || "0");
    const maxState = getMaxState(card, getIsMobileGallery());
    const nextState = currentState >= maxState ? 0 : currentState + 1;
    card.dataset.state = String(nextState);
    updateProjectCard(card);
  };

  const retreatProjectCard = (card: HTMLElement) => {
    const currentState = Number(card.dataset.state || "0");
    const maxState = getMaxState(card, getIsMobileGallery());
    const nextState = currentState <= 0 ? maxState : currentState - 1;
    card.dataset.state = String(nextState);
    updateProjectCard(card);
  };

  const getProjectCardDirection = (
    card: HTMLElement,
    clientX: number,
  ): "next" | "previous" => {
    const bounds = card.getBoundingClientRect();
    return clientX >= bounds.left + bounds.width / 2 ? "next" : "previous";
  };

  const handleProjectCardNavigation = (
    card: HTMLElement,
    direction: "next" | "previous",
  ) => {
    if (direction === "next") {
      advanceProjectCard(card);
      return;
    }

    retreatProjectCard(card);
  };

  const syncProjectCardMode = (card: HTMLElement, nextIsMobile: boolean, previousIsMobile: boolean) => {
    const currentState = card.dataset.state || "0";
    const currentStateNumber = Number(currentState);
    const nextMaxState = getMaxState(card, nextIsMobile);

    if (currentStateNumber <= 1) {
      card.dataset.state = String(Math.min(currentStateNumber, nextMaxState));
      updateProjectCard(card, nextIsMobile);
      return;
    }

    const galleryPanels = getGalleryPanels(card);
    const previousStateAttribute = getStateAttribute(previousIsMobile);
    const nextStateAttribute = getStateAttribute(nextIsMobile);
    const activePanel = galleryPanels.find(
      (panel) => panel.dataset[previousStateAttribute] === currentState,
    );

    let nextState = currentState;

    if (activePanel) {
      nextState =
        activePanel.dataset[nextStateAttribute] ||
        galleryPanels.find(
          (panel) =>
            panel.dataset.galleryItemIndex === activePanel.dataset.galleryItemIndex &&
            panel.dataset[nextStateAttribute],
        )?.dataset[nextStateAttribute] ||
        nextState;
    }

    if (Number(nextState) > nextMaxState) {
      nextState = String(nextMaxState);
    }

    card.dataset.state = nextState;
    updateProjectCard(card, nextIsMobile);
  };

  document.querySelectorAll("[data-project-card]").forEach((el) => {
    const card = el as HTMLElement;
    updateProjectCard(card);

    card.addEventListener("click", (event) => {
      handleProjectCardNavigation(card, getProjectCardDirection(card, event.clientX));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        advanceProjectCard(card);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        retreatProjectCard(card);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advanceProjectCard(card);
      }
    });
  });

  let previousIsMobileGallery = getIsMobileGallery();

  mobileGalleryMediaQuery.addEventListener("change", (event) => {
    document.querySelectorAll("[data-project-card]").forEach((el) => {
      syncProjectCardMode(el as HTMLElement, event.matches, previousIsMobileGallery);
    });

    previousIsMobileGallery = event.matches;
  });
}

type MuxPlayerLike = HTMLElement & {
  media?: { pause: () => void; muted: boolean } | null;
  muted: boolean;
  defaultMuted: boolean;
};

// Belt-and-suspenders guard: during native scroll-snap settling,
// getBoundingClientRect() on an individual video can briefly report stale
// geometry (compositor/main-thread lag), letting a video stay audible one
// project past where the user actually is. This derives the active card
// from scrollTop + each card's static offsetTop instead (immune to that
// lag) and force-silences every video outside of it, on every scroll frame.
export function initGlobalVideoMuteGuard() {
  const main = document.querySelector("main");
  if (!main) {
    return;
  }

  const silence = (player: MuxPlayerLike) => {
    if (player.muted && (!player.media || player.media.muted)) {
      return;
    }

    player.media?.pause();
    player.muted = true;
    player.defaultMuted = true;
    if (player.media) {
      player.media.muted = true;
    }
  };

  const enforce = () => {
    const cards = Array.from(
      document.querySelectorAll("[data-project-card]"),
    ) as HTMLElement[];

    if (!cards.length) {
      return;
    }

    const viewportCenter = main.scrollTop + main.clientHeight / 2;
    let activeCard: HTMLElement | null = null;
    let bestDistance = Infinity;

    cards.forEach((card) => {
      const cardCenter = card.offsetTop + card.offsetHeight / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        activeCard = card;
      }
    });

    document.querySelectorAll("mux-player").forEach((el) => {
      const player = el as MuxPlayerLike;
      if (activeCard && activeCard.contains(player)) {
        return;
      }
      silence(player);
    });
  };

  let rafId: number | null = null;
  const schedule = () => {
    if (rafId !== null) {
      return;
    }
    rafId = requestAnimationFrame(() => {
      enforce();
      rafId = null;
    });
  };

  enforce();
  main.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}
