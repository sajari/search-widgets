import { isNullOrUndefined } from '@sajari/react-sdk-utils';
import { FilterBuilder, Pipeline, RangeFilterBuilder, Variables } from '@sajari/react-search-ui';
import { useMemo } from 'react';

import { mergeProps } from '../../defaults';
import { SearchResultsProps } from '../../types';
import { getPipelineInfo } from '../../utils';

export function useSearchProviderProps(props: SearchResultsProps) {
  const {
    endpoint,
    account,
    collection,
    pipeline,
    filters: filtersProp = [],
    defaultFilter: defaultFilterProp,
    variables: variablesProp,
    theme,
    emitter,
    preset,
    currency,
    config,
    clickTokenURL,
    shopifyOptions,
  } = props;

  const id = `search-ui-${Date.now()}`;
  const {
    fields,
    options,
    tracking,
    customClassNames,
    disableDefaultStyles = false,
    importantStyles = false,
  } = mergeProps({ id, ...props });
  const { name, version = undefined } = getPipelineInfo(pipeline);

  const defaultFilter = useMemo(() => {
    if (
      preset === 'shopify' &&
      !isNullOrUndefined(shopifyOptions?.collectionHandle) &&
      shopifyOptions?.collectionHandle !== 'all' &&
      !isNullOrUndefined(shopifyOptions?.collectionId)
    ) {
      const collectionFilter = `collection_ids ~ ['${shopifyOptions?.collectionId}']`;
      if (defaultFilterProp) {
        return `(${defaultFilterProp}) AND ${collectionFilter}`;
      }
      return collectionFilter;
    }

    return defaultFilterProp;
  }, []);

  const variables = useMemo(() => new Variables({ ...variablesProp }), []);

  const filters = useMemo(() => {
    return filtersProp.map((filter) => {
      const isRangeFilter = filter.type === 'range';
      const filterBuilder = isRangeFilter ? new RangeFilterBuilder(filter) : new FilterBuilder(filter);

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
          clickTokenURL,
        },
        { name, version },
        tracking,
      ),
      config,
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

  return {
    searchContext,
    defaultFilter,
    theme,
    searchOnLoad: options.mode === 'standard',
    context,
    emitter,
    customClassNames,
    disableDefaultStyles,
    importantStyles,
    currency,
  };
}
