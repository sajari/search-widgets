import { createContext } from '@sajari/react-sdk-utils';

import { CustomContainerContextProps } from '../types';

const [CustomContainerContextProvider, useCustomContainer] = createContext<CustomContainerContextProps>({
  strict: true,
});

export default CustomContainerContextProvider;
export { useCustomContainer };
