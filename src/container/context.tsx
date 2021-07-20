import { CustomContainerContextProps } from '../types';
import { createContext } from '../utils';

const [CustomContainerContextProvider, useCustomContainer] = createContext<CustomContainerContextProps>({
  strict: true,
});

export default CustomContainerContextProvider;
export { useCustomContainer };
