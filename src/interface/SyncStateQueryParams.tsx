import {
  EVENT_RANGE_FIRST_AGGREGATE_UPDATED,
  Range,
  RangeFilterBuilder,
  useFilter,
  useQuery,
  useRangeFilter,
  useResultsPerPage,
  useSorting,
} from '@sajari/react-hooks';
import { FilterBuilder, ResultViewType, useSearchUIContext } from '@sajari/react-search-ui';
import { useEffect } from 'preact/hooks';
import { useRef } from 'react';

import { useAppContext } from '../context';
import { useSetQueryParams } from '../hooks/useQueryParam';
import getSearchParams from '../utils/getSearchParams';
import isRange from '../utils/isRange';

const FilterWatcher = ({ filter, replace }: { filter: FilterBuilder; replace: boolean }) => {
  const key = filter.getField() as string;
  const name = filter.getName();
  const { setSelected, selected } = useFilter(name);
  const setFilterParam = useSetQueryParams(key, {
    debounce: 500,
    replace,
    callback: replace
      ? undefined
      : (value) => {
          setSelected(value === '' ? [] : value.split(','));
        },
  });

  useEffect(() => {
    setFilterParam(selected);
  }, [selected]);

  return null;
};

const RangeFilterWatcher = ({ filter, replace }: { filter: RangeFilterBuilder; replace: boolean }) => {
  const key = filter.getField() as string;
  const name = filter.getName();
  const { range, setRange, min, max } = useRangeFilter(name);
  const allowSetParam = useRef(false);

  const setFilterParam = useSetQueryParams(key, {
    debounce: 500,
    replace,
    callback: replace
      ? undefined
      : (value) => {
          let rangeValue: Range = value.split(':').map(Number) as Range;
          if (!isRange(rangeValue)) {
            rangeValue = [min, max];
          }

          setRange(rangeValue);
        },
  });

  const setMinMaxParam = useSetQueryParams(`${key}_min_max`, {
    debounce: 500,
    replace,
  });

  useEffect(() => {
    if (allowSetParam.current) {
      setFilterParam(range?.join(':'));
      setMinMaxParam(filter.getMinMax().join(':'));
    }
  }, [range]);

  useEffect(() => {
    const params = getSearchParams();
    const unregisterListener = filter.listen(EVENT_RANGE_FIRST_AGGREGATE_UPDATED, () => {
      const limit = (params[`${filter.getField()}_min_max` as string] || '').split(':').map(Number) as Range;
      const initial = (params[filter.getField()] || '').split(':').map(Number) as Range;

      if (isRange(limit) && isRange(initial)) {
        filter.setMin(limit[0]);
        filter.setMax(limit[1]);
        filter.set(initial);
      }
      allowSetParam.current = true;
    });

    return () => unregisterListener();
  }, []);

  return null;
};

const SyncStateQueryParams = () => {
  const {
    filterBuilders,
    options: { syncURL, viewType: defaultViewType = 'grid', urlParams },
  } = useAppContext();
  const replace = syncURL === 'replace';
  const { query, setQuery } = useQuery();
  const { sorting, setSorting } = useSorting();
  const { viewType, setViewType } = useSearchUIContext();
  const { resultsPerPage, setResultsPerPage } = useResultsPerPage();
  const setQParam = useSetQueryParams(urlParams?.q || 'q', {
    debounce: 500,
    replace,
    callback: replace ? undefined : setQuery,
  });
  const setSortParam = useSetQueryParams('sort', {
    debounce: 500,
    replace,
    callback: replace ? undefined : setSorting,
  });
  const setShowParam = useSetQueryParams('show', {
    debounce: 500,
    replace,
    defaultValue: 15,
    callback: replace
      ? undefined
      : (value) => {
          setResultsPerPage(Number(value) || 15);
        },
  });
  const setViewTypeParam = useSetQueryParams('viewType', {
    debounce: 500,
    replace,
    defaultValue: defaultViewType,
    callback: replace ? undefined : (value) => setViewType((value as ResultViewType) || defaultViewType),
  });

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
    setViewTypeParam(viewType);
  }, [viewType]);

  return (
    <>
      {filterBuilders.map((filter) => {
        return filter instanceof FilterBuilder ? (
          <FilterWatcher filter={filter} key={filter.getField()} replace={replace} />
        ) : (
          <RangeFilterWatcher filter={filter} key={filter.getField()} replace={replace} />
        );
      })}
    </>
  );
};

export default SyncStateQueryParams;
