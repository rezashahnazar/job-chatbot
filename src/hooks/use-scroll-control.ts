import { useRef, useCallback, useState, useEffect } from "react";

type ScrollBehaviorType = "auto" | "smooth";
type ScrollElementType = HTMLDivElement | null;

export function useScrollControl({
  SCROLL_THRESHOLD = 200,
}: {
  SCROLL_THRESHOLD: number;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  const getScrollElement = useCallback((): ScrollElementType => {
    return scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;
  }, []);

  const handleScroll = useCallback(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    setShowButton(!isNearBottom);
  }, [getScrollElement, SCROLL_THRESHOLD]);

  // Monitor scroll
  useEffect(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [getScrollElement, handleScroll]);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehaviorType = "smooth") => {
      const scrollElement = getScrollElement();
      if (!scrollElement) return;

      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior,
      });
    },
    [getScrollElement]
  );

  const useScrollButton = <T>(messages: T[], isLoading: boolean) => {
    // Auto-scroll only if we're near bottom and new messages arrive
    useEffect(() => {
      if (!isLoading) return;

      const scrollElement = getScrollElement();
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isNearBottom =
        scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;

      if (isNearBottom) {
        scrollToBottom("auto");
      }
    }, [messages, isLoading]);

    return { showButton, scrollToBottom };
  };

  return { scrollAreaRef, useScrollButton };
}
