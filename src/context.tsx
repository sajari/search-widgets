import { createContext } from '@sajari/react-sdk-utils';

import { SearchResultsContextProps } from './types';

const [SearchResultsContextProvider, useSearchResultsContext] = createContext<SearchResultsContextProps>({
  strict: true,
});

export default SearchResultsContextProvider;
export { useSearchResultsContext };
