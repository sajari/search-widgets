/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModalProps } from '@sajari/react-components';
import {
  ContextProviderValues,
  FieldDictionary,
  FilterBuilder,
  FilterProps,
  InputProps as CoreInputProps,
  PaginationProps,
  RangeFilterBuilder,
  ResultsPerPageProps,
  ResultsProps,
  ResultViewType,
  SortingProps,
} from '@sajari/react-search-ui';
import { Emitter } from 'mitt';
import { ComponentChildren } from 'preact';

import { Breakpoints } from '../utils/styles';

export type WidgetType = 'search-results' | 'search-input-binding' | 'overlay' | 'search-input';
export type InputMode = CoreInputProps<any>['mode'];
export type PresetType = 'shopify' | 'website' | 'app' | undefined;
export type TrackingType = 'posneg' | 'click';

interface InputProps extends Omit<CoreInputProps<any>, 'showPoweredBy'> {
  mode?: Exclude<InputMode, 'results'>;
  placeholder?: string;
}

export type SyncURLType = 'none' | 'replace' | 'push';
type SearchResultsMode = 'standard' | 'overlay';
type InputPosition = 'top' | 'aside';
type TextTransform = 'normal-case' | 'uppercase' | 'lowercase' | 'capitalize' | 'capitalize-first-letter';

export type PipelineOption = string | { name: string; version?: string };

export interface SearchWidgetBaseOptions {
  account: string;
  collection: string;
  pipeline: PipelineOption;
  endpoint?: string;
  clickTokenURL?: string;
  tracking?:
    | TrackingType
    | {
        type: TrackingType;
        field: string;
      };
  preset: PresetType;
  fields?: FieldDictionary;
  defaultFilter: ContextProviderValues['defaultFilter'];
  variables: ContextProviderValues['search']['variables'];
  config: ContextProviderValues['search']['config'];
  theme: ContextProviderValues['theme'];
  customClassNames?: ContextProviderValues['customClassNames'];
  disableDefaultStyles?: ContextProviderValues['disableDefaultStyles'];
  importantStyles?: ContextProviderValues['importantStyles'];
  currency?: ContextProviderValues['currency'];
  downshiftEnvironment?: ContextProviderValues['downshiftEnvironment'];
  useShadowDOM?: boolean;
  container?: HTMLElement;
}

export type SearchResultsOptions<M = SearchResultsMode> = {
  showViewType?: boolean;
  resultsPerPage?: ResultsPerPageProps;
  sorting?: Omit<SortingProps, 'type'>;
  input?: InputProps & { hide?: boolean; position?: InputPosition };
  results?: ResultsProps & { viewType?: ResultViewType; mobileViewType?: ResultViewType };
  pagination?: PaginationProps;
  mode?: M;
} & (
  | {
      mode: 'standard';
      syncURL?: SyncURLType;
      urlParams?: {
        q?: string;
      };
    }
  | {
      mode: 'overlay';
      buttonSelector?: string | string[];
      inputSelector?: string;
      ariaLabel?: string;
      defaultOpen?: boolean;
      modal?: ModalProps;
    }
);

interface ShopifyOptions {
  collectionHandle?: string;
  collectionId?: string;
}

export interface SearchResultsProps extends SearchWidgetBaseOptions {
  filters?: Array<FilterProps & { field: string; textTransform?: TextTransform }>;
  options?: SearchResultsOptions;
  emitter: Emitter;
  shopifyOptions?: ShopifyOptions;
}

export interface SearchResultsContextProps
  extends Required<Pick<SearchResultsProps, 'filters' | 'options' | 'preset'>> {
  children?: ComponentChildren;
  filterBuilders: (RangeFilterBuilder | FilterBuilder)[];
  id: string;
}

export interface PubSubContextProps {
  children?: ComponentChildren;
  emitter: Emitter;
}

export interface CustomContainerContextProps {
  children?: ComponentChildren;
  container?: HTMLElement;
}

export interface InterfaceContextProps {
  children?: ComponentChildren;
  breakpoints: Breakpoints;
  filtersShown: boolean;
  setWidth: (width: number) => void;
  setFiltersShown: (shown: boolean) => void;
}

export interface SearchInputProps extends SearchWidgetBaseOptions {
  mode: Exclude<InputMode, 'instant'>;
  redirect?: {
    url: string;
    queryParamName: string;
  };
  emitter?: Emitter;
  options?: Omit<CoreInputProps, 'mode' | 'retainFilters'> & {
    // @deprecated: moved the ability to custom input props into the upper-level options
    // keep the prop for v2 in case customers used it to customize the input but consider dropping the support for the prop in v3
    input?: InputProps;
  };
}

export interface SearchInputBindingProps extends SearchWidgetBaseOptions, Pick<SearchInputProps, 'mode' | 'redirect'> {
  selector: string;
  omittedElementSelectors?: string | string[];
  options?: Omit<CoreInputProps, 'mode' | 'retainFilters'>;
}

export interface TokenCheckInputProps {
  account: string;
  collection: string;
  pipeline: PipelineOption;
  endpoint?: string;
}
