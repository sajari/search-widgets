import { Modal, ModalCloseButton, ResizeObserver } from '@sajari/react-components';
import { useQuery, useSearchContext } from '@sajari/react-hooks';
import { isArray } from '@sajari/react-sdk-utils';
import { Filter, Input, Pagination, Results } from '@sajari/react-search-ui';
import { useEffect, useState } from 'preact/hooks';
import tw from 'twin.macro';

import { useSearchResultsContext } from '../context';
import { getPresetSelectorOverlayMode } from '../defaults';
import { SearchResultsOptions } from '../types';
import { useInterfaceContext } from './context';
import Options from './Options';

function isSubmitInput(node: Element) {
  return node.tagName === 'INPUT' && node.getAttribute('type') === 'submit';
}

function isButton(node: Element) {
  return node.tagName === 'BUTTON' || node.getAttribute('role') === 'button';
}

const OverlayInterface = () => {
  const { options, filters, id, preset } = useSearchResultsContext();
  const { results, pageCount, clear } = useSearchContext();
  const { setQuery } = useQuery();
  const { setWidth, filtersShown } = useInterfaceContext();
  const tabsFilters = filters?.filter((props) => props.type === 'tabs') || [];
  const nonTabsFilters = filters?.filter((props) => props.type !== 'tabs') || [];
  const inputProps = options.input ?? {};
  const {
    buttonSelector: buttonSelectorProp = getPresetSelectorOverlayMode(preset),
    inputSelector,
    ariaLabel = 'Open search',
    defaultOpen = false,
    modal: modalProps,
  } = options as SearchResultsOptions<'overlay'>;
  const [open, setOpen] = useState(defaultOpen);
  const hideSidebar = nonTabsFilters.length === 0;

  useEffect(() => {
    const buttonSelectors = isArray(buttonSelectorProp) ? buttonSelectorProp : [buttonSelectorProp];
    const removeEventList: (() => void)[] = [];

    buttonSelectors.forEach((buttonSelector) => {
      const buttons = document.querySelectorAll(buttonSelector);
      const input = inputSelector ? (document.querySelector(inputSelector) as HTMLInputElement) : null;

      const openModal = (e: Event | KeyboardEvent) => {
        if (e instanceof KeyboardEvent && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
          return;
        }
        e.preventDefault();

        setOpen(true);
        const query = input?.value;
        if (query) {
          setQuery(query);
        }
      };

      buttons.forEach((btn) => {
        // Remove all registered events
        const cloneButton = btn.cloneNode(true) as HTMLElement;
        btn.parentNode?.replaceChild(cloneButton, btn);
        const button = cloneButton;

        if (!isButton(button) || !isSubmitInput(button)) {
          button.setAttribute('role', 'button');
          button.setAttribute('tabIndex', '0');
          button.setAttribute('aria-label', ariaLabel);

          button.querySelectorAll('*').forEach((node) => {
            if (node instanceof HTMLElement) {
              node.setAttribute('aria-hidden', 'true');
              node.setAttribute('tabIndex', '-1');
              // eslint-disable-next-line no-param-reassign
              node.style.pointerEvents = 'none';
            }

            node.addEventListener('click', (e) => {
              e.preventDefault();
            });
          });

          button.addEventListener('keydown', openModal);
        }
        button.addEventListener('click', openModal);
        removeEventList.push(() => {
          button?.removeEventListener('click', openModal);
          button?.removeEventListener('keydown', openModal);
        });
      });
    });

    return () => {
      removeEventList.forEach((removeListener) => removeListener());
    };
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
      {...modalProps}
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
                <Options showToggleFilter={!hideSidebar} />
              </div>
            )}
          </div>

          {results ? (
            <div
              id={id}
              css={[
                tw`flex flex-grow overflow-hidden transition-all duration-200`,
                (!filtersShown || hideSidebar) && tw`pl-6`,
              ]}
            >
              {results && (
                <div
                  css={[
                    tw`transition-all duration-200 overflow-y-auto flex-none`,
                    filtersShown && !hideSidebar ? tw`pr-8 w-86 pl-6` : tw`w-0 opacity-0`,
                  ]}
                >
                  <div css={tw`w-72 space-y-6 pb-6`}>
                    {nonTabsFilters.map((props) => {
                      const { type, textTransform = 'capitalize-first-letter' } = props;
                      if (type === 'list' || type === 'select') {
                        return <Filter {...{ ...props, textTransform }} key={props.name} />;
                      }
                      return <Filter {...props} key={props.name} />;
                    })}
                  </div>
                </div>
              )}

              <div
                css={[tw`flex flex-col`, filtersShown && !hideSidebar ? 'width: calc(100% - 21.5rem);' : tw`w-full`]}
              >
                {tabsFilters.length > 0 ? (
                  <div css={tw`space-y-6 pr-6`}>
                    {tabsFilters.map((props) => {
                      const { textTransform = 'capitalize-first-letter' } = props;
                      return <Filter {...props} type="tabs" textTransform={textTransform} key={props.name} />;
                    })}
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
