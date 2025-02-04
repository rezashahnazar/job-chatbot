"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

const DEBOUNCE_DELAY = 100;

interface MutationObserverConfig {
  childList: boolean;
  subtree: boolean;
  characterData: boolean;
}

const observerConfig: MutationObserverConfig = {
  childList: true,
  subtree: true,
  characterData: true,
} as const;

export function usePageContent(ref: RefObject<HTMLDivElement | null>) {
  const [content, setContent] = useState<string>("");

  const sanitizeText = (text: string | null | undefined): string => {
    return text?.replace(/\s+/g, " ").trim() ?? "";
  };

  const extractTextContent = useCallback((): string => {
    if (!ref.current) return "";

    try {
      const clone = ref.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("script, style").forEach((el) => el.remove());
      return sanitizeText(clone.textContent);
    } catch (error) {
      console.error("[usePageContent] Text extraction failed:", error);
      return "";
    }
  }, [ref]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateContent = () => setContent(extractTextContent());
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateContent, DEBOUNCE_DELAY);
    };

    updateContent();

    const observer = new MutationObserver(debouncedUpdate);
    if (ref.current) {
      observer.observe(ref.current, observerConfig);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [extractTextContent, ref]);

  return content;
}
