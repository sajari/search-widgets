import { Input, InputProps, Pipeline, SearchProvider, Variables } from '@sajari/react-search-ui';
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
    options,
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

  const AppliedInput = (props: InputProps<any> & { name?: string }) => (
    <Input mode={mode} {...options?.input} {...props} showPoweredBy={preset !== 'shopify'} />
  );

  const RenderInput = () => {
    const formRef = useRef<HTMLFormElement>();
    if (redirect && mode !== 'results') {
      return (
        <form ref={formRef} action={redirect.url ?? 'search'}>
          <AppliedInput
            onSelect={() => {
              if (typeof formRef.current.requestSubmit === 'function') {
                formRef.current.requestSubmit();
                return;
              }
              formRef.current.submit();
            }}
            name={redirect.queryParamName || 'q'}
          />
        </form>
      );
    }

    return <AppliedInput />;
  };

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      defaultFilter={defaultFilter}
      currency={currency}
      searchOnLoad={false}
    >
      {emitterContext ? (
        <PubSubContextProvider value={emitterContext}>
          <RenderInput />
        </PubSubContextProvider>
      ) : (
        <RenderInput />
      )}
    </SearchProvider>
  );
};
