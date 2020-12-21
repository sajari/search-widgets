import { Button } from '@sajari/react-components';
import tw from 'twin.macro';

import { useInterfaceContext } from '../context';

export default () => {
  const { filtersShown, setFiltersShown } = useInterfaceContext();
  const toggleFilters = () => setFiltersShown(!filtersShown);

  return (
    <Button type="button" size="sm" onClick={toggleFilters} css={tw`whitespace-nowrap`}>
      {`${filtersShown ? 'Hide' : 'Show'} filters`}
    </Button>
  );
};
