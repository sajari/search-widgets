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
  const hideSidebar =
    (filters?.filter((props) => props.type !== 'tabs') || []).length === 0 && options.input?.position === 'top';
  const { hide = false, ...inputProps } = options.input ?? {};
  const topInput = options.input?.position === 'top';

  return (
    <React.Fragment>
      {syncURL !== 'none' ? <SyncStateQueryParams /> : null}
      <ResizeObserver onResize={(size) => setWidth(size.width)}>
        <div id={id} css={tw`space-y-6`}>
          {!hide && topInput && <Input {...inputProps} css={tw`w-full`} />}
          {results && <Options showToggleFilter={!hideSidebar || !topInput} />}

          <div css={tw`flex`}>
            {results && (
              <div
                css={[
                  tw`transition-all duration-200`,
                  filtersShown && !hideSidebar ? tw`pr-8 w-80` : tw`w-0 opacity-0`,
                ]}
              >
                <div css={tw`w-72 space-y-6`}>
                  {!hide && !topInput && <Input {...inputProps} />}

                  {filters
                    ?.filter((props) => props.type !== 'tabs')
                    .map((props) => {
                      const { type, textTransform = 'capitalize-first-letter' } = props;
                      if (type === 'list' || type === 'select') {
                        return <Filter {...{ ...props, textTransform }} key={props.name} />;
                      }
                      return <Filter {...props} key={props.name} />;
                    })}
                </div>
              </div>
            )}

            <div css={[tw`flex-1 space-y-6`, filtersShown && !hideSidebar ? 'width: calc(100% - 20rem);' : tw`w-full`]}>
              {tabsFilters.length > 0
                ? tabsFilters.map((props) => {
                    const { textTransform = 'capitalize-first-letter' } = props;
                    return <Filter {...props} type="tabs" textTransform={textTransform} key={props.name} />;
                  })
                : null}

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
