import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import Lottie from 'lottie-react';
import { getStickerDefinition } from '../../features/stickers/stickerCatalog';

interface Props {
  name: string;
  size?: number;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

type LottieJson = Record<string, unknown>;

const LOADED_CACHE = new Map<string, LottieJson>();
const INFLIGHT_CACHE = new Map<string, Promise<LottieJson>>();

const loadLottieJson = async (url: string): Promise<LottieJson> => {
  const cached = LOADED_CACHE.get(url);
  if (cached) return cached;

  const inflight = INFLIGHT_CACHE.get(url);
  if (inflight) return inflight;

  const request = fetch(url, { cache: 'force-cache' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Lottie source not found: ${response.status}`);
      const json = (await response.json()) as LottieJson;
      LOADED_CACHE.set(url, json);
      INFLIGHT_CACHE.delete(url);
      return json;
    })
    .catch((error) => {
      INFLIGHT_CACHE.delete(url);
      throw error;
    });

  INFLIGHT_CACHE.set(url, request);
  return request;
};

export const AnimatedSticker = ({
  name,
  size = 56,
  className,
  loop = true,
  autoplay = true
}: Props) => {
  const [animationData, setAnimationData] = useState<LottieJson | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [errorSource, setErrorSource] = useState<string | null>(null);
  const sticker = getStickerDefinition(name);
  const fallbackEmoji = sticker?.fallbackEmoji ?? '✨';

  useEffect(() => {
    let mounted = true;

    if (!sticker) {
      return;
    }

    void loadLottieJson(sticker.source)
      .then((json) => {
        if (!mounted) return;
        setAnimationData(json);
        setLoadedSource(sticker.source);
        setErrorSource(null);
      })
      .catch(() => {
        if (!mounted) return;
        setErrorSource(sticker.source);
      });

    return () => {
      mounted = false;
    };
  }, [sticker]);

  const isCurrentLoaded = Boolean(sticker && loadedSource === sticker.source && animationData);
  const hasCurrentError = Boolean(sticker && errorSource === sticker.source);

  if (hasCurrentError || !sticker) {
    return (
      <div
        className={cn('flex items-center justify-center text-[22px] shrink-0 pointer-events-none select-none', className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {fallbackEmoji}
      </div>
    );
  }

  if (!isCurrentLoaded) {
    return (
      <div
        className={cn('flex items-center justify-center text-[20px] shrink-0 pointer-events-none select-none', className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div
      className={cn('shrink-0 pointer-events-none select-none', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: size, height: size }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  );
};
