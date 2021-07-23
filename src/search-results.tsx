import { SearchProvider } from '@sajari/react-search-ui';
import { useEffect, useMemo, useState } from 'react';

import CustomContainerContextProvider from './container/context';
import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import Interface from './interface';
import PubSubContextProvider from './pubsub/context';
import { SearchResultsProps } from './types';

const messageType = 'sajari-shopify-ui-builder-update';

export default (defaultProps: SearchResultsProps) => {
  const { container } = defaultProps;
  const [state, setState] = useState(defaultProps);
  const {
    emitter,
    context,
    searchContext,
    theme,
    searchOnLoad,
    defaultFilter,
    viewType,
    customClassNames,
    disableDefaultStyles,
    importantStyles,
    currency,
  } = useSearchProviderProps(state);

  const emitterContext = useMemo(() => ({ emitter }), [emitter]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const {
        data: { type, payload },
      } = event;

      if (type === messageType) {
        setState(payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={searchOnLoad}
      defaultFilter={defaultFilter}
      viewType={viewType}
      customClassNames={customClassNames}
      disableDefaultStyles={disableDefaultStyles}
      importantStyles={importantStyles}
      currency={currency}
    >
      <PubSubContextProvider value={emitterContext}>
        <SearchResultsContextProvider value={context}>
          <CustomContainerContextProvider value={useMemo(() => ({ container }), [])}>
            <Interface />
          </CustomContainerContextProvider>
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
