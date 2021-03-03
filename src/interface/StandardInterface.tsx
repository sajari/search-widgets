import { ResizeObserver } from '@sajari/react-components';
import { useSearchContext } from '@sajari/react-hooks';
import { Filter, Input, Pagination, Results } from '@sajari/react-search-ui';
import React from 'react';
import tw from 'twin.macro';

import { useSearchResultsContext } from '../context';
import { SearchResultsOptions } from '../types';
import { useInterfaceContext } from './context';
import Options from './Options';
import SyncStateQueryParams from './SyncStateQueryParams';

const StandardInterface = () => {
  const { options, filters, id } = useSearchResultsContext();
  const { syncURL } = options as SearchResultsOptions<'standard'>;
  const { results } = useSearchContext();
  const { setWidth, filtersShown } = useInterfaceContext();
  const tabsFilters = filters?.filter((props) => props.type === 'tabs') || [];
  const { hide = false, ...inputProps } = options.input ?? {};

  return (
    <React.Fragment>
      {syncURL !== 'none' ? <SyncStateQueryParams /> : null}
      <ResizeObserver onResize={(size) => setWidth(size.width)}>
        <div id={id} css={tw`space-y-6`}>
          {results && <Options />}

          <div css={tw`flex`}>
            {results && (
              <div css={[tw`transition-all duration-200`, filtersShown ? tw`pr-8 w-80` : tw`w-0 opacity-0`]}>
                <div css={tw`w-72 space-y-6`}>
                  {!hide && <Input {...inputProps} />}

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
    </React.Fragment>
  );
};

export default StandardInterface;
