import {
  ContextProviderValues,
  FieldDictionary,
  FilterBuilder,
  Pipeline,
  SearchProvider,
  Variables,
} from '@sajari/react-search-ui';
import { isString, merge } from 'lodash-es';
import { useMemo } from 'preact/hooks';

import AppContextProvider from './context';
import { getDefaultFields, mergeDefaults } from './defaults';
import Interface from './interface';
import { AppProps } from './types';
import getSearchParams from './utils/getSearchParams';

// TODO: should be exported from the search-ui package
type ViewType = Required<ContextProviderValues>['viewType'];

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
    viewType: viewTypeProp = 'grid',
    syncURL = 'none',
  } = props;

  const id = `search-ui-${Date.now()}`;
  const options = mergeDefaults(id, preset, optionsProp);
  const { name, version = undefined } = isString(pipeline) ? { name: pipeline } : pipeline;
  const params = syncURL === 'none' ? {} : getSearchParams();
  const viewType: ViewType = ['grid', 'list'].includes(params.viewType) ? (params.viewType as ViewType) : viewTypeProp;

  const variables = useMemo(() => {
    const validKeys = ['q', 'sort', 'show'];
    const mapKeys: Record<string, string> = { show: 'resultsPerPage' };
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
      const initial = value ? value.split(',') : [];
      const filterBuilder = new FilterBuilder(filter);
      filterBuilder.set(initial);

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
    syncURL,
  };

  return (
    <SearchProvider search={searchContext} theme={theme} searchOnLoad defaultFilter={defaultFilter} viewType={viewType}>
      <AppContextProvider value={context}>
        <Interface />
      </AppContextProvider>
    </SearchProvider>
  );
};
