import { PubSubContextProps } from '../types';
import { createContext } from '../utils';

const [PubSubContextProvider, usePubSub] = createContext<PubSubContextProps>({
  strict: true,
});

export default PubSubContextProvider;
export { usePubSub };
