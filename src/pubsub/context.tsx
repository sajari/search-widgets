import { createContext } from '@sajari/react-sdk-utils';

import { PubSubContextProps } from '../types';

const [PubSubContextProvider, usePubSub] = createContext<PubSubContextProps>({
  strict: true,
});

export default PubSubContextProvider;
export { usePubSub };
