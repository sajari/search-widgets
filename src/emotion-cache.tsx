import createCache from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/core';
import { createPortal, Fragment } from 'preact/compat';
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
      container
        ? createCache({
            key: cacheKey,
            container: container?.getRootNode() as HTMLElement,
          })
        : null,
    [container],
  );

  // if no container provided, render wrapped children as-is
  if (!emotionCache) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={css`
          :host {
            font-size: 16px;
            line-height: 1.5;
            box-sizing: border-box;

            *,
            *:before,
            *:after {
              box-sizing: inherit;
            }
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
