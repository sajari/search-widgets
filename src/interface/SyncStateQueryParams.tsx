import { EVENT_SELECTION_UPDATED, useQuery, useResultsPerPage, useSorting } from '@sajari/react-hooks';
import { useSearchUIContext } from '@sajari/react-search-ui';
import { useEffect } from 'preact/hooks';

import { useAppContext } from '../context';
import { useSetQueryParams } from '../hooks/useQueryParam';

const SyncStateQueryParams = () => {
  const { filterBuilders, syncURL } = useAppContext();
  const replace = syncURL === 'replace';
  const { query } = useQuery();
  const { sorting } = useSorting();
  const { viewType } = useSearchUIContext();
  const { resultsPerPage } = useResultsPerPage();
  const setQParam = useSetQueryParams('q', { debounce: 500, replace });
  const setSortParam = useSetQueryParams('sort', { debounce: 500, replace });
  const setShowParam = useSetQueryParams('show', { debounce: 500, replace, defaultValue: 15 });
  const setViewType = useSetQueryParams('viewType', { debounce: 500, replace, defaultValue: 'grid' });
  const setFilterCallbacks: Record<string, (val: string[]) => void> = {};
  // Since the filter list is static, we "can" declare hooks inside a for loop
  // eslint-disable-next-line no-restricted-syntax
  for (const filter of filterBuilders) {
    const key = filter.getField() as string;
    setFilterCallbacks[key] = useSetQueryParams(key, { debounce: 500, replace });
  }

  useEffect(() => {
    setQParam(query);
  }, [query]);

  useEffect(() => {
    setSortParam(sorting);
  }, [sorting]);

  useEffect(() => {
    setShowParam(resultsPerPage);
  }, [resultsPerPage]);

  useEffect(() => {
    setViewType(viewType);
  }, [viewType]);

  useEffect(() => {
    const unregisterListeners = filterBuilders.map((filter) => {
      const key = filter.getField() as string;
      return filter.listen(EVENT_SELECTION_UPDATED, () => {
        setFilterCallbacks[key](filter.get());
      });
    });

    return () => {
      unregisterListeners.forEach((func) => func());
    };
  }, []);

  return null;
};

export default SyncStateQueryParams;
