import { Button, Label } from '@sajari/react-components';
import { useTranslation } from 'react-i18next';
import tw from 'twin.macro';

import { useInterfaceContext } from '../context';

export default () => {
  const { filtersShown, setFiltersShown } = useInterfaceContext();
  const toggleFilters = () => setFiltersShown(!filtersShown);
  const { t } = useTranslation('filter');
  const label = filtersShown ? t('hide') : t('show');

  return (
    <Button
      role="switch"
      aria-checked={filtersShown}
      type="button"
      size="sm"
      onClick={toggleFilters}
      css={tw`whitespace-nowrap m-0`}
      id="toggle-filters"
    >
      {label}
      <Label css={tw`sr-only`} htmlFor="toggle-filters">
        Toggle Filters
      </Label>
    </Button>
  );
};
