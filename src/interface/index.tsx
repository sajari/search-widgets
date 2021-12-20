import { isSSR } from '@sajari/react-sdk-utils';
import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { useCustomContainer } from '../container/context';
import { useSearchResultsContext } from '../context';
import { EmotionCache, renderInContainer } from '../emotion-cache';
import { useDebounce } from '../hooks';
import { parseBreakpoints } from '../utils/styles';
import InterfaceContextProvider from './context';
import OverlayInterface from './OverlayInterface';
import StandardInterface from './StandardInterface';
import TokenCheckBlank from './TokenCheckBlank';

export default memo(() => {
  const { container } = useCustomContainer();
  const [filtersShown, setFiltersShown] = useState(true);
  const {
    options: { mode },
  } = useSearchResultsContext();
  const [width, setWidth] = useState(isSSR() ? 0 : window.screen.width);
  const debouncedWidth = useDebounce(width, 100);
  const breakpoints = parseBreakpoints(debouncedWidth);

  useEffect(() => {
    if (breakpoints.md !== null && !breakpoints.md) {
      setFiltersShown(false);
    }
  }, [JSON.stringify(breakpoints)]);

  const context = useMemo(
    () => ({
      breakpoints,
      filtersShown,
      setFiltersShown,
      setWidth,
    }),
    [breakpoints, filtersShown, setFiltersShown, setWidth],
  );

  const cacheKey = `search-results-${mode}`;

  return (
    <InterfaceContextProvider value={context}>
      {mode === 'standard' ? (
        renderInContainer(<StandardInterface />, { cacheKey, container })
      ) : (
        <EmotionCache cacheKey={cacheKey} container={container}>
          <OverlayInterface />
          <TokenCheckBlank />
        </EmotionCache>
      )}
    </InterfaceContextProvider>
  );
});
