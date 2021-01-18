import {
  FieldDictionary,
  FilterBuilder,
  Pipeline,
  Range,
  RangeFilterBuilder,
  ResultViewType,
  SearchProvider,
  Variables,
} from '@sajari/react-search-ui';
import { isString, merge } from 'lodash-es';
import { useMemo } from 'preact/hooks';

import AppContextProvider from './context';
import { getDefaultFields, mergeDefaults } from './defaults';
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
    preset,
    filters: filtersProp = [],
    defaultFilter,
    variables: variablesProp,
    fields: fieldsProp,
    options: optionsProp,
    theme,
  } = props;

  const id = `search-ui-${Date.now()}`;
  const options = mergeDefaults(id, preset, optionsProp);
  const { name, version = undefined } = isString(pipeline) ? { name: pipeline } : pipeline;
  const params = options.syncURL === 'none' ? {} : getSearchParams();
  const viewType: ResultViewType = ['grid', 'list'].includes(params.viewType)
    ? (params.viewType as ResultViewType)
    : options.viewType ?? 'grid';

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

  const fields = new FieldDictionary(merge(getDefaultFields(preset), fieldsProp));

  const searchContext = useMemo(() => {
    return {
      pipeline: new Pipeline(
        {
          account,
          collection,
          endpoint,
        },
        { name, version },
      ),
      variables,
      fields,
      filters,
    };
  }, []);

  const context = {
    account,
    collection,
    pipeline,
    filters: filtersProp,
    filterBuilders: filters,
    defaultFilter,
    options,
    variables,
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
