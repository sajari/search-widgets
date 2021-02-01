import {
  FilterBuilder,
  Pipeline,
  Range,
  RangeFilterBuilder,
  ResultViewType,
  SearchProvider,
  Variables,
} from '@sajari/react-search-ui';
import { isString } from 'lodash-es';
import { useMemo } from 'preact/hooks';

import AppContextProvider from './context';
import { mergeProps } from './defaults';
import Interface from './interface';
import { AppProps } from './types';
import { isRange, paramToRange } from './utils';
import getSearchParams from './utils/getSearchParams';

export default (props: AppProps) => {
  const {
    endpoint,
    account,
    collection,
    pipeline,
    filters: filtersProp = [],
    defaultFilter,
    variables: variablesProp,
    theme,
  } = props;

  const id = `search-ui-${Date.now()}`;
  const { fields, options, tracking } = mergeProps({ id, ...props });
  const { name, version = undefined } = isString(pipeline) ? { name: pipeline } : pipeline;
  const params = options.syncURL === 'none' ? {} : getSearchParams();
  const viewType: ResultViewType = ['grid', 'list'].includes(params.viewType)
    ? (params.viewType as ResultViewType)
    : options.results?.viewType ?? 'grid';

  const variables = useMemo(() => {
    const queryKey = options.urlParams?.q || 'q';
    const validKeys = [queryKey, 'sort', 'show'];
    const mapKeys: Record<string, string> = { [queryKey]: 'q', show: 'resultsPerPage' };
    const variablesFromParams = validKeys.reduce((a, c) => {
      if (c in params) {
        if (mapKeys[c]) {
          return { ...a, [mapKeys[c]]: params[c] };
        }
        return { ...a, [c]: params[c] };
      }

      return a;
    }, {});

    return new Variables({
      ...variablesProp,
      ...variablesFromParams,
    });
  }, []);

  const filters = useMemo(() => {
    return filtersProp.map((filter) => {
      const value = params[filter.field as string] || '';
      const isRangeFilter = filter.type === 'range';
      const filterBuilder = isRangeFilter ? new RangeFilterBuilder(filter) : new FilterBuilder(filter);

      if (filterBuilder instanceof RangeFilterBuilder) {
        const initialRange = paramToRange(value);
        if (isRange(initialRange)) {
          filterBuilder.set(initialRange as Range);
        }
      } else {
        filterBuilder.set(value ? value.split(',') : []);
      }

      return filterBuilder;
    });
  }, []);

  const searchContext = useMemo(() => {
    return {
      pipeline: new Pipeline(
        {
          account,
          collection,
          endpoint,
        },
        { name, version },
        tracking,
      ),
      variables,
      fields,
      filters,
    };
  }, []);

  const context = {
    filters: filtersProp,
    filterBuilders: filters,
    options,
    id,
  };

  return (
    <SearchProvider search={searchContext} theme={theme} searchOnLoad defaultFilter={defaultFilter} viewType={viewType}>
      <AppContextProvider value={context}>
        <Interface />
      </AppContextProvider>
    </SearchProvider>
  );
};
