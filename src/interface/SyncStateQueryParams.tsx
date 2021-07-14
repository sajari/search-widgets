import {
  Range,
  RangeFilterBuilder,
  useFilter,
  useQuery,
  useRangeFilter,
  useResultsPerPage,
  useSearchContext,
  useSorting,
} from '@sajari/react-hooks';
import { FilterBuilder, ResultViewType, useSearchUIContext } from '@sajari/react-search-ui';
import { useEffect } from 'preact/hooks';
import React, { useRef } from 'react';

import { useSearchResultsContext } from '../context';
import { useSetQueryParams } from '../hooks/useQueryParam';
import { SearchResultsOptions } from '../types';
import { isRange, paramToRange, rangeToParam } from '../utils';

const FilterWatcher = ({ filter, replace }: { filter: FilterBuilder; replace: boolean }) => {
  const key = filter.getField() || filter.getName();
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
  const key = filter.getField() || filter.getName();
  const name = filter.getName();
  const { range, setRange, min, max, reset } = useRangeFilter(name);
  const allowSetParam = useRef(false);
  const { response, results } = useSearchContext();

  const setFilterParam = useSetQueryParams(key, {
    debounce: 500,
    replace,
    callback: replace
      ? undefined
      : (value) => {
          const rangeValue = paramToRange(value);
          if (!isRange(rangeValue) || rangeValue[0] === rangeValue[1]) {
            if (filter.isAggregate()) {
              // if aggregate, call reset to set range "null"
              reset();
            } else {
              setRange([min, max]);
            }
          } else {
            setRange(rangeValue as Range);
          }
        },
  });

  const setMinMaxParam = useSetQueryParams(`${key}_min_max`, {
    debounce: 500,
    // Prevent min_max from being a part of the history
    replace: true,
  });

  useEffect(() => {
    if (allowSetParam.current) {
      if (range) {
        const shouldSetNewValue = range[0] !== min || range[1] !== max;
        setFilterParam(shouldSetNewValue ? rangeToParam(range) : '');
        if (filter.isAggregate()) {
          setMinMaxParam(shouldSetNewValue ? filter.getMinMax().join(':') : '');
        }
      } else {
        setMinMaxParam('');
        setFilterParam('');
      }
    }
  }, [range]);

  useEffect(() => {
    // We don't want to populate the params in the URL when there is no interation with the app
    if (response) {
      allowSetParam.current = true;
    }
  }, [response]);

  useEffect(() => {
    if (results && filter.getFrozen()) {
      // wait for the cycle of React to end then releasing the frozen state
      setTimeout(() => {
        filter.setFrozen(false);
      });
    }
  }, [results]);

  return null;
};

const SyncStateQueryParams = () => {
  const { filterBuilders, options } = useSearchResultsContext();
  const { syncURL, results: resultsOptions = {}, urlParams } = options as SearchResultsOptions<'standard'>;
  const { viewType: defaultViewType = 'grid' } = resultsOptions;
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
    <React.Fragment>
      {filterBuilders.map((filter) => {
        return filter instanceof FilterBuilder ? (
          <FilterWatcher filter={filter} key={filter.getField()} replace={replace} />
        ) : (
          <RangeFilterWatcher
            filter={(filter as unknown) as RangeFilterBuilder}
            key={filter.getField()}
            replace={replace}
          />
        );
      })}
    </React.Fragment>
  );
};

export default SyncStateQueryParams;
