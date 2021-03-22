import { Input, SearchProvider } from '@sajari/react-search-ui';

import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import PubSubContextProvider from './pubsub/context';
import { SearchInputProps } from './types';

export default (defaultProps: SearchInputProps) => {
  const { emitter, context, searchContext, theme, searchOnLoad, defaultFilter, viewType } = useSearchProviderProps(
    defaultProps,
  );

  const emitterContext = {
    emitter,
  };

  const { mode, options } = defaultProps;

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
          <Input mode={mode} {...options?.input} />
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
