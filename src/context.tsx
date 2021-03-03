import { SearchResultsContextProps } from './types';
import { createContext } from './utils';

const [SearchResultsContextProvider, useSearchResultsContext] = createContext<SearchResultsContextProps>({
  strict: true,
});

export default SearchResultsContextProvider;
export { useSearchResultsContext };
