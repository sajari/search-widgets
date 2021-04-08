import { SearchProvider } from '@sajari/react-search-ui';
import { useEffect, useState } from 'react';

import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import Interface from './interface';
import PubSubContextProvider from './pubsub/context';
import { SearchResultsProps } from './types';

const messageType = 'sajari-shopify-ui-builder-update';

export default (defaultProps: SearchResultsProps) => {
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
  } = useSearchProviderProps(state);

  const emitterContext = {
    emitter,
  };

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
    >
      <PubSubContextProvider value={emitterContext}>
        <SearchResultsContextProvider value={context}>
          <Interface />
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
