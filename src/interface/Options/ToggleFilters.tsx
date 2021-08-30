import { Button } from '@sajari/react-components';
import { useTranslation } from 'react-i18next';
import tw from 'twin.macro';

import { useInterfaceContext } from '../context';

export default () => {
  const { filtersShown, setFiltersShown } = useInterfaceContext();
  const toggleFilters = () => setFiltersShown(!filtersShown);
  const { t } = useTranslation('filter');

  return (
    <Button type="button" size="sm" onClick={toggleFilters} css={tw`whitespace-nowrap m-0`}>
      {filtersShown ? t('hide') : t('show')}
    </Button>
  );
};
