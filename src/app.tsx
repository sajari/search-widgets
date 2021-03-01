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
import { useEffect, useState } from 'react';

import AppContextProvider from './context';
import { mergeProps } from './defaults';
import Interface from './interface';
import PubSubContextProvider from './pubsub/context';
import { AppProps } from './types';
import { isRange, paramToRange } from './utils';
import getSearchParams from './utils/getSearchParams';

const validOrigins = [
  'http://localhost:',
  'https://localhost:',
  'https://app.sajari.com',
  'https://app.sajari-staging.io',
];

const messageType = 'sajari-shopify-ui-builder-update';

export default (defaultProps: AppProps) => {
  const [state, setState] = useState(defaultProps);
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
  } = state;

  const id = `search-ui-${Date.now()}`;
  const { fields, options, tracking } = mergeProps({ id, ...state });
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
    mode: options.mode,
  };

  const emitterContext = {
    emitter,
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const {
        origin,
        data: { type, payload },
      } = event;
      if (validOrigins.some((o) => origin.startsWith(o)) && type === messageType) {
        setState(payload);
      }
    }
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={options.mode === 'standard'}
      defaultFilter={defaultFilter}
      viewType={viewType}
    >
      <PubSubContextProvider value={emitterContext}>
        <AppContextProvider value={context}>
          <Interface />
        </AppContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
