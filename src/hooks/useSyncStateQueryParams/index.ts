import {
  EVENT_SELECTION_UPDATED,
  useQuery,
  useResultsPerPage,
  useSearchContext,
  useSorting,
} from '@sajari/react-hooks';
import { useEffect } from 'preact/hooks';

import { useAppContext } from '../../context';
import { useSetQueryParams } from '../useQueryParam';

export function useSyncStateQueryParams() {
  const { query } = useQuery();
  const { sorting } = useSorting();
  const { resultsPerPage } = useResultsPerPage();
  const { viewType } = useSearchContext();
  const setQParam = useSetQueryParams('q', { debounce: 500, replace: true });
  const setSortParam = useSetQueryParams('sort', { debounce: 500, replace: true });
  const setShowParam = useSetQueryParams('show', { debounce: 500, replace: true, defaultValue: 15 });
  const setViewType = useSetQueryParams('viewType', { debounce: 500, replace: true, defaultValue: 'grid' });
  const setFilterCallbacks: Record<string, (val: string[]) => void> = {};
  const { filterBuilders } = useAppContext();
  // Since the filter list is static, we "can" declare hooks inside a for loop
  // eslint-disable-next-line no-restricted-syntax
  for (const filter of filterBuilders) {
    const key = filter.getField() as string;
    setFilterCallbacks[key] = useSetQueryParams(key, { debounce: 500, replace: true });
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
}
