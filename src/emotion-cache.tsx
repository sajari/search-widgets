import createCache from '@emotion/cache';
import { CacheProvider, css, Global } from '@emotion/core';
import { createPortal } from 'preact/compat';
import { useMemo } from 'preact/hooks';

import { remUnitRegex } from './utils';

export const EmotionCache = ({
  children,
  container,
  cacheKey,
}: {
  children: JSX.Element;
  container?: HTMLElement;
  cacheKey: string;
}) => {
  const emotionCache = useMemo(
    () =>
      createCache({
        key: cacheKey,
        container: (container?.getRootNode() as HTMLElement) ?? document.head,
        stylisPlugins: container && [
          (context, content) => {
            // check for attr values
            if (context !== 1 || typeof content !== 'string') {
              return content;
            }
            // find digit from REM value
            return content.replace(remUnitRegex, (match, remDigit) => {
              // convert REM to PX
              const amount = Number(remDigit);
              if (Number.isNaN(amount)) {
                return match;
              }
              return `calc(var(--root-font-size) * ${amount})`;
            });
          },
        ],
      }),
    [container],
  );
  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={css`
          :host {
            --root-font-size: 16px;
            font-size: var(--root-font-size);
            line-height: 1.5;
            box-sizing: border-box;
          }
          *,
          *:before,
          *:after {
            box-sizing: inherit;
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
