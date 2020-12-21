import { InterfaceContextProps } from '../types';
import { createContext } from '../utils';

const [InterfaceContextProvider, useInterfaceContext] = createContext<InterfaceContextProps>({
  strict: true,
});

export default InterfaceContextProvider;
export { useInterfaceContext };
