import { ResultsPerPage, Sorting, Summary as CoreSummary, ViewType } from '@sajari/react-search-ui';
import tw, { styled } from 'twin.macro';

import { useSearchResultsContext } from '../../context';
import { useInterfaceContext } from '../context';
import ToggleFilters from './ToggleFilters';

const Summary = styled(CoreSummary)`
  ${tw`text-lg`}
`;

interface Props {
  showToggleFilter?: boolean;
}

export default ({ showToggleFilter = true }: Props) => {
  const { options } = useSearchResultsContext();
  const { breakpoints } = useInterfaceContext();
  const md = Boolean(breakpoints.md);

  return (
    <div css={md ? tw`flex items-center justify-between space-x-4` : tw`space-y-4`}>
      <Summary />

      <div css={[tw`flex items-end space-x-4`, md ? tw`justify-end` : tw`justify-between`]}>
        <ResultsPerPage size="sm" inline={md} options={options.resultsPerPage?.options} />

        {options.sorting?.options && options.sorting.options.length > 0 && (
          <Sorting type="select" size="sm" inline={md} options={options.sorting?.options} />
        )}

        <ViewType size="sm" inline={md} />

        {showToggleFilter && <ToggleFilters />}
      </div>
    </div>
  );
};
