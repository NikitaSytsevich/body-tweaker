import { useEffect, useMemo, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import pako from 'pako';

interface AnimatedEmojiProps {
  name?: string;
  src?: string;
  size?: number;
  className?: string;
  fallback?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const AnimatedEmoji = ({
  name,
  src: overrideSrc,
  size = 160,
  className,
  fallback = '✨',
  loop = true,
  autoplay = true,
}: AnimatedEmojiProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const src = useMemo(() => {
    if (overrideSrc) return overrideSrc;
    if (name) return `/emoji/${name}.tgs`;
    return '';
  }, [overrideSrc, name]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!src) {
      setUseFallback(true);
      return;
    }
    if (prefersReducedMotion()) {
      setUseFallback(true);
      return;
    }

    let isActive = true;

    const load = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error('Emoji not found');
        const buffer = await response.arrayBuffer();
        const unzipped = pako.ungzip(new Uint8Array(buffer));
        const json = JSON.parse(new TextDecoder('utf-8').decode(unzipped));

        if (!isActive || !containerRef.current) return;

        animationRef.current?.destroy();
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: json,
        });
      } catch {
        if (isActive) setUseFallback(true);
      }
    };

    load();

    return () => {
      isActive = false;
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [src, loop, autoplay]);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {useFallback ? (
        <div className="flex h-full w-full items-center justify-center text-[40px]">
          {fallback}
        </div>
      ) : (
        <div ref={containerRef} className="h-full w-full" />
      )}
    </div>
  );
};
