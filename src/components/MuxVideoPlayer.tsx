import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

declare global {
  interface HTMLVideoElement {
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
    webkitEnterFullscreen?: () => void;
  }

  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }
}

type Props = {
  playbackId: string;
  poster?: string;
  className?: string;
  title?: string;
  fit?: "contain" | "cover";
};

const shouldPlay = (player: MuxPlayerElement) => {
  const panel = player.closest("[data-gallery-state]") as HTMLElement | null;
  if (panel) {
    return panel.dataset.visible === "true";
  }

  const card = player.closest("[data-project-card]") as HTMLElement | null;
  const isMainMedia = Boolean(player.closest("[data-main-media]"));

  if (card && isMainMedia) {
    return Number(card.dataset.state || "0") <= 1;
  }

  return true;
};

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function MuxVideoPlayer({
  playbackId,
  poster,
  className,
  title,
  fit = "contain",
}: Props) {
  const videoRef = useRef<MuxPlayerElement>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) {
      return;
    }

    const syncPlayback = () => {
      const media = player.media;
      if (!media) {
        return;
      }

      media.muted = true;
      player.muted = true;
      player.defaultMuted = true;
      player.playsInline = true;
      setIsMuted(media.muted);

      if (shouldPlay(player)) {
        media.play().catch(() => {});
      } else {
        media.pause();
      }
    };

    const card = player.closest("[data-project-card]");
    const panel = player.closest("[data-gallery-state]");
    const observers: MutationObserver[] = [];

    if (card) {
      const observer = new MutationObserver(syncPlayback);
      observer.observe(card, {
        attributes: true,
        attributeFilter: ["data-state"],
      });
      observers.push(observer);
    }

    if (panel) {
      const observer = new MutationObserver(syncPlayback);
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ["data-visible"],
      });
      observers.push(observer);
    }

    syncPlayback();

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const syncInputMode = () => {
      setIsTouchDevice(mediaQuery.matches);
      setShowControls((current) => (mediaQuery.matches ? current : false));
    };

    syncInputMode();
    mediaQuery.addEventListener("change", syncInputMode);

    return () => {
      mediaQuery.removeEventListener("change", syncInputMode);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isTouchDevice) {
      return;
    }

    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    if (!showControls) {
      return;
    }

    if (hideControlsTimeoutRef.current) {
      window.clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 1800);

    return () => {
      if (hideControlsTimeoutRef.current) {
        window.clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    };
  }, [isPlaying, isTouchDevice, showControls]);

  const playerStyles = useMemo(
    () =>
      ({
        "--controls": "none",
        "--media-control-display": "none",
        "--media-control-bar-display": "none",
        "--media-text-display-display": "none",
        "--media-time-range-display": "none",
        "--media-preview-time-display-display": "none",
        "--media-preview-thumbnail-display": "none",
        "--media-object-fit": fit,
      }) as CSSProperties,
    [fit],
  );

  const stopPropagation = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const revealControls = () => {
    if (!isTouchDevice) {
      return;
    }

    setShowControls(true);
  };

  const handlePlayPause = () => {
    const media = videoRef.current?.media;
    if (!media) {
      return;
    }

    if (media.paused) {
      media.play().catch(() => {});
      setIsPlaying(true);
      revealControls();
      return;
    }

    media.pause();
    setIsPlaying(false);
    setShowControls(true);
  };

  const handleVideoSurfaceClick = () => {
    if (isTouchDevice && isPlaying && !showControls) {
      setShowControls(true);
      return;
    }

    handlePlayPause();
  };

  const handleMute = () => {
    const media = videoRef.current?.media;
    if (!media) {
      return;
    }

    media.muted = !media.muted;
    setIsMuted(media.muted);
    revealControls();
  };

  const handleFullscreen = () => {
    const el = videoRef.current as
      | (MuxPlayerElement & {
          mozRequestFullScreen?: () => Promise<void>;
          webkitRequestFullscreen?: () => Promise<void>;
          msRequestFullscreen?: () => Promise<void>;
          webkitEnterFullscreen?: () => void;
        })
      | null;

    if (el?.requestFullscreen) {
      el.requestFullscreen();
    } else if (el?.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el?.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el?.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el?.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }

    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    setIsFullscreen(false);
    revealControls();
  };

  const handleTimeUpdate = () => {
    const media = videoRef.current?.media;
    if (media) {
      setCurrentTime(media.currentTime);
      setIsPlaying(!media.paused);
    }
  };

  const handleVideoEnd = () => {
    const media = videoRef.current?.media;
    if (!media) {
      return;
    }

    media.currentTime = 0;
    media.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleLoadedMetadata = () => {
    const media = videoRef.current?.media;
    if (media) {
      setDuration(media.duration);
      setCurrentTime(media.currentTime);
      setIsPlaying(!media.paused);
      setIsMuted(media.muted);
      setShowControls(media.paused);
    }
  };

  const handleProgressBarClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const clickPosition =
      event.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    const media = videoRef.current?.media;

    if (media) {
      media.currentTime = seekTime;
      setCurrentTime(seekTime);
      revealControls();
    }
  };

  const progressPercent =
    Number.isFinite(duration) && duration > 0
      ? (currentTime / duration) * 100
      : 0;

  return (
    <div
      className={`flex h-full w-full max-h-full max-w-full flex-col items-center justify-center ${className ?? ""}`}
    >
      <div className="group/video relative h-full w-auto max-h-full max-w-full pointer-events-auto">
        {!isPlaying && (
          <div className="pointer-events-none absolute top-0 flex h-full w-full items-center justify-center">
            <svg
              className="fill-white"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
            >
              <path d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" />
            </svg>
          </div>
        )}

        {!isLoaded && (
          <div className="absolute h-full w-full max-h-full max-w-full animate-pulse bg-black/15" />
        )}

        <div
          className="h-full w-full max-h-full max-w-full cursor-pointer"
          onClick={handleVideoSurfaceClick}
        >
          <MuxPlayer
            playbackId={playbackId}
            poster={poster}
            title={title}
            preferPlayback="mse"
            minResolution="720p"
            className="mux-clean hide-controls h-full w-full max-h-full max-w-full"
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={() => setIsLoaded(true)}
            autoPlay="muted"
            muted
            loop
            playsInline
            disableTracking
            style={playerStyles}
          />
        </div>

        <div
          className={`absolute bottom-0 w-full bg-linear-to-t from-gray-950/35 via-gray-950/25 transition-opacity duration-150 ${
            isPlaying
              ? isTouchDevice
                ? showControls
                  ? "opacity-100"
                  : "opacity-0"
                : "opacity-0 md:delay-[1.5s] group-hover/video:opacity-100 group-hover/video:delay-0"
              : "opacity-100"
          }`}
        >
          <div className="grid w-full grid-cols-10 gap-6">
            <div
              className="col-span-10 col-start-1 my-3 flex items-center gap-3 px-4 font-avant-garde text-xs text-white md:col-span-6 md:col-start-3 md:px-0"
              onClick={stopPropagation}
            >
              <button type="button" onClick={handlePlayPause}>
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button type="button" onClick={handleMute}>
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <span className="whitespace-nowrap font-normal">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div
                onClick={handleProgressBarClick}
                className="group/progress relative flex h-1 w-full cursor-pointer items-center"
              >
                <div
                  className="absolute left-0 right-0 h-[0.065rem] bg-neutral-500/80 group-hover/progress:h-full"
                  style={{
                    transitionProperty: "height",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    transitionDuration: "150ms",
                  }}
                />
                <div
                  className="absolute left-0 h-[0.175rem] bg-white group-hover/progress:h-full"
                  style={{
                    width: `${progressPercent}%`,
                    transitionProperty: "height",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    transitionDuration: "150ms",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={isFullscreen ? handleExitFullscreen : handleFullscreen}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="stroke-white transition-transform hover:scale-110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.5 2.5H0.5V6.5" />
                  <path d="M9.5 13.5L15.5 13.5L15.5 9.5" />
                  <path d="M6.5 13.5L0.5 13.5L0.5 9.5" />
                  <path d="M9.5 2.5L15.5 2.5L15.5 6.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
