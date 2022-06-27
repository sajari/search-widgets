import { SearchProvider } from '@sajari/react-search-ui';
import { useEffect, useMemo, useState } from 'react';

import CustomContainerContextProvider from './container/context';
import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import Interface from './interface';
import PubSubContextProvider from './pubsub/context';
import { SearchResultsOptions, SearchResultsProps } from './types';

const messageType = 'sajari-shopify-ui-builder-update';

export default (defaultProps: SearchResultsProps) => {
  const { container, downshiftEnvironment } = defaultProps;
  const [state, setState] = useState(defaultProps);
  const {
    emitter,
    context,
    searchContext,
    theme,
    searchOnLoad,
    defaultFilter,
    customClassNames,
    disableDefaultStyles,
    importantStyles,
    currency,
    viewType,
  } = useSearchProviderProps(state);
  const { syncURL = 'push', mode, urlParams } = context.options as SearchResultsOptions<'standard'>;
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
      customClassNames={customClassNames}
      disableDefaultStyles={disableDefaultStyles}
      importantStyles={importantStyles}
      currency={currency}
      downshiftEnvironment={downshiftEnvironment}
      viewType={viewType}
      syncURLState={
        syncURL !== 'none' && mode === 'standard'
          ? { replace: syncURL === 'replace', paramKeys: { q: urlParams?.q ?? 'q' } }
          : false
      }
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
