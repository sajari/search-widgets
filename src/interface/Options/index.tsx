import { ResultsPerPage, Sorting, Summary as CoreSummary, ViewType } from '@sajari/react-search-ui';
import tw, { styled } from 'twin.macro';

import { useAppContext } from '../../context';
import { useInterfaceContext } from '../context';
import ToggleFilters from './ToggleFilters';

const Summary = styled(CoreSummary)`
  ${tw`text-lg`}
`;

export default () => {
  const { options } = useAppContext();
  const { breakpoints } = useInterfaceContext();
  const md = Boolean(breakpoints.md);

  return (
    <div css={md ? tw`flex items-center justify-between space-x-4` : tw`space-y-4`}>
      <Summary />

      <div css={[tw`flex items-end space-x-4`, md ? tw`justify-end` : tw`justify-between`]}>
        <ResultsPerPage size="sm" inline={md} options={options.resultsPerPage?.options} />

        <Sorting size="sm" inline={md} options={options.sorting?.options} />

        <ViewType size="sm" inline={md} />

        <ToggleFilters />
      </div>
    </div>
  );
};
