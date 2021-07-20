import { isSSR } from '@sajari/react-sdk-utils';
import { memo } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { useSearchResultsContext } from '../context';
import { useDebounce } from '../hooks';
import { parseBreakpoints } from '../utils/styles';
import InterfaceContextProvider from './context';
import OverlayInterface from './OverlayInterface';
import StandardInterface from './StandardInterface';

export default memo(() => {
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

  return (
    <InterfaceContextProvider value={context}>
      {mode === 'standard' ? <StandardInterface /> : <OverlayInterface />}
    </InterfaceContextProvider>
  );
});
