import { useTracking } from '@sajari/react-hooks';
import { useEffect } from 'react';

const TokenCheckBlank = () => {
  const { posNegLocalStorageManager } = useTracking();
  useEffect(() => {
    posNegLocalStorageManager.sendPendingClicks();
  }, []);
  return null;
};

export default TokenCheckBlank;
