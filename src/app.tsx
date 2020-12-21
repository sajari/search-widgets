import { FieldDictionary, FilterBuilder, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { isString, merge } from 'lodash-es';

import AppContextProvider from './context';
import { defaultFields, mergeDefaults } from './defaults';
import { useQueryParam } from './hooks';
import Interface from './interface';
import { AppProps } from './types';

export default (props: AppProps) => {
  const {
    endpoint = 'https://jsonapi-us-valkyrie.sajari.net',
    account,
    collection,
    pipeline,
    filters = [],
    variables: variablesProp,
    fields: fieldsProp,
    options: optionsProp,
    theme,
  } = props;
  const id = `search-ui-${Date.now()}`;
  const options = mergeDefaults(id, optionsProp);
  const { name, version = undefined } = isString(pipeline) ? { name: pipeline } : pipeline;
  const { value: q } = useQueryParam('q');

  const variables = new Variables({
    q,
    ...variablesProp,
  });

  const fields = new FieldDictionary(merge(defaultFields, fieldsProp));

  const searchContext = {
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
    filters: filters.map((filter) => new FilterBuilder(filter)),
  };

  const context = {
    ...props,
    endpoint,
    fields,
    filters,
    options,
    variables,
    id,
  };

  return (
    <SearchProvider search={searchContext} theme={theme} searchOnLoad>
      <AppContextProvider value={context}>
        <Interface />
      </AppContextProvider>
    </SearchProvider>
  );
};
