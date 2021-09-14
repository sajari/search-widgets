import { callAllHandlers } from '@sajari/react-sdk-utils';
import { Input, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
import { useRef } from 'preact/hooks';
import { useMemo } from 'react';

import PubSubContextProvider from './pubsub/context';
import { SearchInputProps } from './types';
import { getPipelineInfo } from './utils';
import { getTracking } from './utils/getTracking';

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

  const formRef = useRef<HTMLFormElement>();
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
      fields,
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
    inputRender = (
      <form ref={formRef} action={redirect.url ?? 'search'} css={['font-size: 16px']}>
        <Input
          {...options?.input}
          {...options}
          onSelect={callAllHandlers(() => {
            if (typeof formRef.current.requestSubmit === 'function') {
              formRef.current.requestSubmit();
              return;
            }
            formRef.current.submit();
          }, options.onSelect)}
          mode={mode}
          name={redirect.queryParamName || 'q'}
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
