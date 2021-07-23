import createCache from '@emotion/cache';
import { CacheProvider, Global, css } from '@emotion/core';
import { createPortal } from 'preact/compat';
import { useMemo } from 'preact/hooks';

export const EmotionCache = ({ children, container }: { children: JSX.Element; container?: HTMLElement }) => {
  const emotionCache = useMemo(
    () => createCache({ container: (container?.getRootNode() as HTMLElement) ?? document.head }),
    [container],
  );
  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={css`
          :host {
            font-size: 16px;
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

export const renderInContainer = (node: JSX.Element, container?: HTMLElement) => {
  return container ? createPortal(<EmotionCache container={container}>{node}</EmotionCache>, container) : node;
};
