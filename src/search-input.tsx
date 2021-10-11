import { useAutocomplete } from '@sajari/react-hooks';
import { callAllHandlers } from '@sajari/react-sdk-utils';
import { Input, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { useRef } from 'preact/hooks';
import { useCallback, useMemo } from 'react';

import { shopifyFieldMapping } from './defaults';
import PubSubContextProvider from './pubsub/context';
import { SearchInputProps } from './types';
import { getPipelineInfo } from './utils';
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
  const { redirects, searching } = useAutocomplete();
  const redirectsRef = useRef(redirects);
  redirectsRef.current = redirects;
  const onKeydownMemoized = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && (mode === 'typeahead' || mode === 'suggestions' || mode === 'standard')) {
        const { value } = e.currentTarget;
        const redirectValue = redirectsRef.current[value];
        if (redirectValue) {
          window.location.assign(redirectValue.token || redirectValue.target);
          e.preventDefault();
        } else if (searching) {
          // If we're performing an autocomplete search, wait a tick to recheck redirects before unloading
          setTimeout(() => {
            const redirectTarget = redirectsRef.current[value];
            if (redirectTarget) {
              window.location.assign(redirectTarget.token || redirectTarget.target);
            } else {
              submitForm(formRef);
            }
          }, 400);
          e.preventDefault();
        }
      }
    },
    [searching],
  );
  return (
    <form ref={formRef} action={redirect.url ?? 'search'} css={['font-size: 16px']}>
      <Input
        {...options?.input}
        {...options}
        onSelect={callAllHandlers(() => {
          submitForm(formRef);
        }, options.onSelect)}
        onKeyDown={callAllHandlers(onKeydownMemoized, options.onKeyDown)}
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
    options = {},
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
  } = defaultProps;

  const tracking = getTracking(defaultProps);

  const searchContext = useMemo(() => {
    const { name, version = undefined } = getPipelineInfo(pipeline);
    const variables = new Variables({ ...variablesProp });
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
