import { useEffect, useState } from 'preact/hooks';

import { useAppContext } from '../context';
import { useDebounce } from '../hooks';
import { parseBreakpoints } from '../utils/styles';
import InterfaceContextProvider from './context';
import OverlayInterface from './OverlayInterface';
import StandardInterface from './StandardInterface';

export default () => {
  const [filtersShown, setFiltersShown] = useState(true);
  const {
    options: { mode },
  } = useAppContext();
  const [width, setWidth] = useState(0);
  const debouncedWidth = useDebounce(width, 100);
  const breakpoints = parseBreakpoints(debouncedWidth);

  useEffect(() => {
    if (breakpoints.md !== null && !breakpoints.md) {
      setFiltersShown(false);
    }
  }, [JSON.stringify(breakpoints)]);

  const context = {
    breakpoints,
    filtersShown,
    setFiltersShown,
    setWidth,
  };

  return (
    <InterfaceContextProvider value={context}>
      {mode === 'standard' ? <StandardInterface /> : <OverlayInterface />}
    </InterfaceContextProvider>
  );
};
