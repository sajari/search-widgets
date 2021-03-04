import { Modal, ModalCloseButton, ResizeObserver } from '@sajari/react-components';
import { useQuery, useSearchContext } from '@sajari/react-hooks';
import { Filter, Input, Pagination, Results } from '@sajari/react-search-ui';
import { useEffect, useState } from 'preact/hooks';
import tw from 'twin.macro';

import { useSearchResultsContext } from '../context';
import { getPresetSelector } from '../defaults';
import { SearchResultsOptions } from '../types';
import { useInterfaceContext } from './context';
import Options from './Options';

function isSubmitInput(node: Element) {
  return node.tagName === 'INPUT' && node.getAttribute('type') === 'submit';
}

const OverlayInterface = () => {
  const { options, filters, id, preset } = useSearchResultsContext();
  const { results, pageCount, clear } = useSearchContext();
  const { setQuery } = useQuery();
  const { setWidth, filtersShown } = useInterfaceContext();
  const [open, setOpen] = useState(false);
  const tabsFilters = filters?.filter((props) => props.type === 'tabs') || [];
  const inputProps = options.input ?? {};
  const { buttonSelector: buttonSelectorProp, inputSelector } = options as SearchResultsOptions<'overlay'>;

  useEffect(() => {
    let buttonSelector = buttonSelectorProp;
    if (!buttonSelectorProp) {
      buttonSelector = getPresetSelector(preset);
    }
    if (buttonSelector) {
      const button = document.querySelector(buttonSelector);
      const input = inputSelector ? (document.querySelector(inputSelector) as HTMLInputElement) : null;

      if (button) {
        const openModal = (e: Event) => {
          if (isSubmitInput(button)) {
            e.preventDefault();
          }
          setOpen(true);
          const query = input?.value;
          if (query) {
            setQuery(query);
          }
        };
        button.addEventListener('click', openModal);

        return () => {
          button.removeEventListener('click', openModal);
        };
      }
    }
    return () => {};
  }, [buttonSelectorProp, inputSelector]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
        clear({ q: '' });
      }}
      center={false}
      size="7xl"
      animationDuration={75}
    >
      <ResizeObserver onResize={(size) => setWidth(size.width)} css={tw`overflow-hidden h-full flex`}>
        <div css={[tw`w-full flex flex-col flex-none overflow-hidden`]}>
          <div css={tw`flex-none`}>
            <div css={tw`py-2.5 pl-2.5 flex items-center`}>
              <Input {...inputProps} css={tw`w-full`} />
              <div css={tw`flex-none w-14 flex justify-center`}>
                <ModalCloseButton css={tw`m-0`} />
              </div>
            </div>

            {results && (
              <div css={tw`pt-3.5 px-6 pb-6`}>
                <Options />
              </div>
            )}
          </div>

          {results ? (
            <div
              id={id}
              css={[tw`flex flex-grow overflow-hidden transition-all duration-200`, !filtersShown && tw`pl-6`]}
            >
              {results && (
                <div
                  css={[
                    tw`transition-all duration-200 overflow-y-auto flex-none`,
                    filtersShown ? tw`pr-8 w-86 pl-6` : tw`w-0 opacity-0`,
                  ]}
                >
                  <div css={tw`w-72 space-y-6 pb-6`}>
                    {filters
                      ?.filter((props) => props.type !== 'tabs')
                      .map((props) => (
                        <Filter {...props} key={props.name} />
                      ))}
                  </div>
                </div>
              )}

              <div css={[tw`flex flex-col`, filtersShown ? 'width: calc(100% - 21.5rem);' : tw`w-full`]}>
                {tabsFilters.length > 0 ? (
                  <div css={tw`space-y-6 pr-6`}>
                    {tabsFilters.map((props) => (
                      <Filter {...props} key={props.name} />
                    ))}
                  </div>
                ) : null}

                <div css={tw`overflow-y-auto pt-6 pr-6`}>
                  <div css={tw`mb-6`}>
                    <Results {...options.results} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {pageCount > 1 ? (
            <div css={tw`flex-none border-0 border-t border-solid border-gray-200 py-3.5 px-6`}>
              <Pagination {...options.pagination} />
            </div>
          ) : null}
        </div>
      </ResizeObserver>
    </Modal>
  );
};

export default OverlayInterface;
