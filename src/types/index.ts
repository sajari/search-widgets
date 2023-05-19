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
  Tracking,
} from '@sajari/react-search-ui';
import { Emitter } from 'mitt';
import { ComponentChildren } from 'preact';

import { Breakpoints } from '../utils/styles';

export type WidgetType = 'search-results' | 'search-input-binding' | 'overlay' | 'search-input' | 'tracking';
export type InputMode = CoreInputProps<any>['mode'];
export type PresetType = 'shopify' | 'website' | 'app' | undefined;
export type TrackingType = 'posneg' | 'click' | 'event';

interface InputProps extends CoreInputProps<any> {
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
  searchIOAnalyticsEndpoint?: string;
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
  summary?: {
    suggest?: boolean;
  };
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
    urlParams?: {
      q: string;
    };
  };
  // `enableRedirectOnResultsModeSearch` enables redirects to work when using the
  //  search input in results mode.
  //
  // By default, the `redirect` prop is ignored if `mode` is set to `results`.
  // The reasoning behind this is not clear - it may have been implemented this
  // way due to a misunderstanding. We're reluctant to change the default behaviour
  // of the search input as it introduces breaking changes (this change is the result
  // of a single customer request).
  enableRedirectOnResultsModeSearch?: boolean;
}

export interface SearchInputBindingProps extends SearchWidgetBaseOptions, Pick<SearchInputProps, 'mode' | 'redirect'> {
  selector: string;
  omittedElementSelectors?: string | string[];
  options?: Omit<CoreInputProps, 'mode' | 'retainFilters'> & {
    urlParams?: {
      q: string;
    };
  };
  // Set `disableRedirectOnResultSelect` to true if `mode` is set to `results`,
  // `redirect` has been provided, and you want to preserve the default dropdown
  // result onSelect behaviour, rather than being redirected as specified in the
  // `redirect` prop.
  disableRedirectOnResultSelect?: boolean;
}

export interface TokenCheckInputProps {
  account: string;
  collection: string;
  pipeline: PipelineOption;
  endpoint?: string;
}

export interface TrackingEvent {
  selector?: string;
  // the event to trigger the tracking call (onClick, onSubmit, etc...)
  event: string;
  metadata: {
    id: string | number;
    event: string;
    data?: Record<string, number | boolean | string>;
  };
}

export interface TrackingProps extends Pick<SearchWidgetBaseOptions, 'account' | 'collection' | 'pipeline'> {
  // the field used to pass into EventTracking constructor (must be unique across records)
  id: string;
  events: Array<TrackingEvent>;
  tracking?: Tracking;
  searchIOAnalyticsEndpoint?: string;
}
