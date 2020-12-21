import { AppContextProps } from './types';
import { createContext } from './utils';

const [AppContextProvider, useAppContext] = createContext<AppContextProps>({
  strict: true,
});

export default AppContextProvider;
export { useAppContext };
