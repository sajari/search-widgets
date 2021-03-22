import { isBoolean, isString } from '@sajari/react-sdk-utils';
import { FilterBuilder, Pipeline, Range, RangeFilterBuilder, ResultViewType, Variables } from '@sajari/react-search-ui';
import { useMemo } from 'react';

import { mergeProps } from '../../defaults';
import { SearchResultsProps } from '../../types';
import { isRange, paramToRange } from '../../utils';
import getSearchParams from '../../utils/getSearchParams';

export function useSearchProviderProps(props: SearchResultsProps) {
  const {
    endpoint,
    account,
    collection,
    pipeline,
    filters: filtersProp = [],
    defaultFilter,
    variables: variablesProp,
    theme,
    emitter,
    preset,
    customClassNames,
    disableDefaultStyles = false,
  } = props;

  const id = `search-ui-${Date.now()}`;
  const { fields, options, tracking } = mergeProps({ id, ...props });
  const { name, version = undefined } = isString(pipeline) ? { name: pipeline } : pipeline;
  const params = options.mode === 'standard' && options?.syncURL === 'none' ? {} : getSearchParams();

  const viewType: ResultViewType = ['grid', 'list'].includes(params.viewType)
    ? (params.viewType as ResultViewType)
    : options.results?.viewType ?? 'grid';

  const variables = useMemo(() => {
    if (options.mode === 'standard') {
      const queryKey = options?.urlParams?.q || 'q';
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
    }

    return new Variables({ ...variablesProp });
  }, []);

  const filters = useMemo(() => {
    return filtersProp.map((filter) => {
      const value = params[filter.field as string] || '';
      const isRangeFilter = filter.type === 'range';
      const filterBuilder = isRangeFilter ? new RangeFilterBuilder(filter) : new FilterBuilder(filter);

      if (filterBuilder instanceof RangeFilterBuilder) {
        const initialRange = paramToRange(value);
        const limit = (params[`${filter.field}_min_max` as string] || '').split(':').map(Number) as Range;
        if (isRange(initialRange)) {
          filterBuilder.set(initialRange as Range);
        }
        if (isRange(limit)) {
          filterBuilder.setMin(limit[0]);
          filterBuilder.setMax(limit[1]);
          // Freeze the state of the filterBuilder to avoid the UI from being overridden at the first response
          filterBuilder.setFrozen(true);
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
    mode: options.mode,
    preset,
  };

  const searchOnLoad = isBoolean(options.searchOnLoad) ? options.searchOnLoad : options.mode === 'standard';

  return {
    searchContext,
    defaultFilter,
    viewType,
    theme,
    searchOnLoad,
    context,
    emitter,
    customClassNames,
    disableDefaultStyles,
  };
}
