import { ResizeObserver } from '@sajari/react-components';
import { useSearchContext } from '@sajari/react-hooks';
import { Filter, Input, Pagination, Results } from '@sajari/react-search-ui';
import { useEffect, useState } from 'preact/hooks';
import tw from 'twin.macro';

import { useAppContext } from '../context';
import { useDebounce } from '../hooks';
import { parseBreakpoints } from '../utils/styles';
import InterfaceContextProvider from './context';
import Options from './Options';
import SyncStateQueryParams from './SyncStateQueryParams';

export default () => {
  const [filtersShown, setFiltersShown] = useState(true);
  const { options, filters, id } = useAppContext();
  const [width, setWidth] = useState(0);
  const debouncedWidth = useDebounce(width, 100);
  const breakpoints = parseBreakpoints(debouncedWidth);
  const { results } = useSearchContext();

  useEffect(() => {
    if (breakpoints.md !== null && !breakpoints.md) {
      setFiltersShown(false);
    }
  }, [JSON.stringify(breakpoints)]);

  const context = {
    breakpoints,
    filtersShown,
    setFiltersShown,
  };

  const tabsFilters = filters?.filter((props) => props.type === 'tabs') || [];

  return (
    <InterfaceContextProvider value={context}>
      {options.syncURL !== 'none' ? <SyncStateQueryParams /> : null}

      <ResizeObserver onResize={(size) => setWidth(size.width)}>
        <div id={id} css={tw`space-y-6`}>
          {results && <Options />}

          <div css={tw`flex`}>
            {results && (
              <div css={[tw`transition-all duration-200`, filtersShown ? tw`pr-8 w-80` : tw`w-0 opacity-0`]}>
                <div css={[tw`w-72 space-y-6`, filtersShown ? 'whitespace-nowrap' : tw``]}>
                  <Input {...options.input} />

                  {filters
                    ?.filter((props) => props.type !== 'tabs')
                    .map((props) => (
                      <Filter {...props} key={props.name} />
                    ))}
                </div>
              </div>
            )}

            <div css={[tw`flex-1 space-y-6`, filtersShown ? 'width: calc(100% - 20rem);' : tw`w-full`]}>
              {tabsFilters.length > 0 ? tabsFilters.map((props) => <Filter {...props} key={props.name} />) : null}

              <Results {...options.results} />

              <Pagination {...options.pagination} />
            </div>
          </div>
        </div>
      </ResizeObserver>
    </InterfaceContextProvider>
  );
};
