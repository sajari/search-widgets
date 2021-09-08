import createCache from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/core';
import { createPortal } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import type { ReactNode } from 'react';

export const EmotionCache = ({
  children,
  container,
  cacheKey,
}: {
  children: ReactNode;
  container?: HTMLElement;
  cacheKey: string;
}) => {
  const emotionCache = useMemo(
    () =>
      createCache({
        key: cacheKey,
        container: (container?.getRootNode() as HTMLElement) ?? document.head,
      }),
    [container],
  );
  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={css`
          :host {
            font-size: 16px;
            line-height: 1.5;
            box-sizing: border-box;
          }
        `}
      />
      {children}
    </CacheProvider>
  );
};

export const renderInContainer = (
  node: JSX.Element,
  { cacheKey, container }: { cacheKey: string; container?: HTMLElement },
) => {
  return container
    ? createPortal(
        <EmotionCache cacheKey={cacheKey} container={container}>
          {node}
        </EmotionCache>,
        container,
      )
    : node;
};
