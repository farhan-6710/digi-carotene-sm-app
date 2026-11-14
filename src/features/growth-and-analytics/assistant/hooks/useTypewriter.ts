import { useEffect, useState } from "react";

const MIN_STEP = 1;
const CATCH_UP_FRAMES = 30;

/**
 * Reveals `target` a few characters per animation frame so streamed chunks still read as typing.
 */
export function useTypewriter(
  target: string,
  live: boolean,
): { text: string; isTyping: boolean } {
  const [shown, setShown] = useState(() => (live ? 0 : target.length));

  useEffect(() => {
    if (shown >= target.length) return;
    const frame = requestAnimationFrame(() => {
      const hidden = target.length - shown;
      setShown(
        Math.min(
          target.length,
          shown + Math.max(MIN_STEP, Math.ceil(hidden / CATCH_UP_FRAMES)),
        ),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [shown, target.length]);

  return { text: target.slice(0, shown), isTyping: shown < target.length };
}
