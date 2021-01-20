import { SearchProvider } from '@sajari/react-search-ui';
import { useEffect, useState } from 'react';

import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import Interface from './interface';
import PubSubContextProvider from './pubsub/context';
import { SearchResultsProps } from './types';

const validOrigins = [
  'http://localhost:',
  'https://localhost:',
  'https://app.sajari.com',
  'https://app.sajari-staging.io',
];

const messageType = 'sajari-shopify-ui-builder-update';

export default (defaultProps: SearchResultsProps) => {
  const [state, setState] = useState(defaultProps);
  const { emitter, context, searchContext, theme, searchOnLoad, defaultFilter, viewType } = useSearchProviderProps(
    state,
  );

  const emitterContext = {
    emitter,
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const {
        origin,
        data: { type, payload },
      } = event;
      if (validOrigins.some((o) => origin.startsWith(o)) && type === messageType) {
        setState(payload);
      }
    }
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
    >
      <PubSubContextProvider value={emitterContext}>
        <SearchResultsContextProvider value={context}>
          <Interface />
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
