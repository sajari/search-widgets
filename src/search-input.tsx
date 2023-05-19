import { callAllHandlers } from '@sajari/react-sdk-utils';
import { Input, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { useRef } from 'preact/hooks';
import { useMemo } from 'react';

import { shopifyFieldMapping } from './defaults';
import PubSubContextProvider from './pubsub/context';
import { SearchInputProps } from './types';
import { getPipelineInfo } from './utils';
import getSearchParams from './utils/getSearchParams';
import { getTracking } from './utils/getTracking';

const submitForm = (formRef: React.RefObject<HTMLFormElement | null | undefined>) => {
  if (typeof formRef.current?.requestSubmit === 'function') {
    formRef.current.requestSubmit();
    return;
  }
  formRef.current?.submit();
};

const AutocompleteInput = ({
  options,
  redirect,
  mode,
  preset,
}: Required<Pick<SearchInputProps, 'options' | 'redirect' | 'mode' | 'preset'>>) => {
  const formRef = useRef<HTMLFormElement>();
  const showPoweredBy = options.showPoweredBy ?? preset !== 'shopify';
  return (
    <form ref={formRef} action={redirect.url ?? 'search'} css={['font-size: 16px']}>
      <Input
        {...options?.input}
        {...options}
        onSelect={callAllHandlers(() => submitForm(formRef), options.onSelect)}
        mode={mode}
        name={redirect.queryParamName || 'q'}
        showPoweredBy={showPoweredBy}
      />
    </form>
  );
};

export default (defaultProps: SearchInputProps) => {
  const {
    variables: variablesProp,
    emitter,
    options = {
      input: {
        minimumCharacters: 3,
      },
      urlParams: {
        q: 'q',
      },
    },
    preset,
    mode = 'suggestions',
    redirect,
    account,
    collection,
    endpoint,
    clickTokenURL,
    pipeline,
    config,
    fields,
    theme,
    defaultFilter,
    currency,
    customClassNames,
    enableRedirectOnResultsModeSearch,
  } = defaultProps;

  const tracking = getTracking(defaultProps);

  const searchContext = useMemo(() => {
    const { name, version = undefined } = getPipelineInfo(pipeline);
    const params = getSearchParams();
    const q = params[options.urlParams?.q ?? 'q'] || '';
    const variables = new Variables({ ...variablesProp, q });
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
      fields: preset === 'shopify' ? { ...shopifyFieldMapping, ...fields } : fields,
    };
  }, []);

  const emitterContext = useMemo(
    () =>
      emitter
        ? {
            emitter,
          }
        : undefined,
    [emitter],
  );

  const showPoweredBy = options.showPoweredBy ?? preset !== 'shopify';
  let inputRender: React.ReactNode;

  if (redirect && mode !== 'results') {
    inputRender = <AutocompleteInput options={options} redirect={redirect} mode={mode} preset={preset} />;
  } else if (redirect && mode === 'results' && enableRedirectOnResultsModeSearch) {
    inputRender = (
      <form action={redirect.url ?? 'search'} css={['font-size: 16px']}>
        <Input
          mode={mode}
          {...options?.input}
          {...options}
          name={redirect.queryParamName || 'q'}
          autoComplete="off"
          showPoweredBy={showPoweredBy}
        />
      </form>
    );
  } else {
    inputRender = <Input mode={mode} {...options?.input} {...options} showPoweredBy={showPoweredBy} />;
  }

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      defaultFilter={defaultFilter}
      currency={currency}
      searchOnLoad={false}
      customClassNames={customClassNames}
    >
      {emitterContext ? (
        <PubSubContextProvider value={emitterContext}>{inputRender}</PubSubContextProvider>
      ) : (
        inputRender
      )}
    </SearchProvider>
  );
};
