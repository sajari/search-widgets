import { Input, InputProps, SearchProvider } from '@sajari/react-search-ui';
import { useRef } from 'preact/hooks';

import SearchResultsContextProvider from './context';
import { useSearchProviderProps } from './hooks';
import PubSubContextProvider from './pubsub/context';
import { SearchInputProps } from './types';

export default (defaultProps: SearchInputProps) => {
  const {
    emitter,
    context,
    searchContext,
    theme,
    searchOnLoad,
    defaultFilter,
    viewType,
    currency,
  } = useSearchProviderProps(defaultProps);

  const emitterContext = {
    emitter,
  };

  const { mode = 'suggestions', redirect, preset } = defaultProps;
  const { options } = context;
  const AppliedInput = (props: InputProps<any> & { name?: string }) => (
    <Input {...options?.input} {...props} mode={mode} showPoweredBy={preset !== 'shopify'} />
  );

  const RenderInput = () => {
    const formRef = useRef<HTMLFormElement>();
    if (redirect && mode !== 'results') {
      return (
        <form ref={formRef} action={redirect.url ?? 'search'}>
          <AppliedInput onSelect={() => formRef.current.submit()} name={redirect.queryParamName || 'q'} />
        </form>
      );
    }

    return <AppliedInput />;
  };

  return (
    <SearchProvider
      search={searchContext}
      theme={theme}
      searchOnLoad={searchOnLoad}
      defaultFilter={defaultFilter}
      currency={currency}
      viewType={viewType}
    >
      <PubSubContextProvider value={emitterContext}>
        <SearchResultsContextProvider value={context}>
          <RenderInput />
        </SearchResultsContextProvider>
      </PubSubContextProvider>
    </SearchProvider>
  );
};
