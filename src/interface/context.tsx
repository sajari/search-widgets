import { createContext } from '@sajari/react-sdk-utils';

import { InterfaceContextProps } from '../types';

const [InterfaceContextProvider, useInterfaceContext] = createContext<InterfaceContextProps>({
  strict: true,
});

export default InterfaceContextProvider;
export { useInterfaceContext };
