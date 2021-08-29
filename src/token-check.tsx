import { Pipeline, SearchProvider, useTracking } from '@sajari/react-hooks';
import { useEffect, useMemo } from 'react';

import { TokenCheckInputProps } from './types';
import { getPipelineInfo } from './utils';

const TokenCheckBlank = () => {
  const { posNegLocalStorageManager } = useTracking();
  useEffect(() => {
    posNegLocalStorageManager.sendPendingClicks();
  }, []);
  return null;
};

/**
 * When a user clicks on a search result from a result page with PosNegTracking enabled, a
 * tracking token is pushed into local storage. This is a very low latency way of storing
 * pos tokens for later consumption.
 * This component sends those pending tracking tokens.
 */
export default (defaultProps: TokenCheckInputProps) => {
  const { account, collection, endpoint, pipeline: pipelineOption } = defaultProps;

  const pipeline = useMemo(() => {
    const { name, version = undefined } = getPipelineInfo(pipelineOption);
    return new Pipeline(
      {
        account,
        collection,
        endpoint,
      },
      { name, version },
    );
  }, []);

  return (
    <SearchProvider search={{ pipeline }}>
      <TokenCheckBlank />
    </SearchProvider>
  );
};
