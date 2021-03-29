import { Results, SearchProvider } from '@sajari/react-search-ui';
import { useState } from 'react';

import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import PubSubContextProvider from './pubsub/context';
import { DynamicContentProps } from './types';

export default (defaultProps: DynamicContentProps) => {
  const [state] = useState(defaultProps);
  const {
    emitter,
    context,
    searchContext,
    theme,
    defaultFilter,
    viewType,
    customClassNames,
    disableDefaultStyles,
  } = useSearchProviderProps(state);

  const emitterContext = {
    emitter,
  };

  const {
    options: { results = {} },
  } = context;

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad
      defaultFilter={defaultFilter}
      viewType={viewType}
      customClassNames={customClassNames}
      disableDefaultStyles={disableDefaultStyles}
    >
      <PubSubContextProvider value={emitterContext}>
        <SearchResultsContextProvider value={context}>
          <Results {...results} />
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
