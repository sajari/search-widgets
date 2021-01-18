/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ComponentChildren } from 'preact';

import { Breakpoints } from '../utils/styles';

interface InputProps extends CoreInputProps<any> {
  mode?: Exclude<CoreInputProps<any>['mode'], 'results'>;
}

export type SyncURLType = 'none' | 'replace' | 'push';

export interface AppOptions {
  resultsPerPage?: ResultsPerPageProps;
  sorting?: SortingProps;
  input?: InputProps;
  results?: ResultsProps;
  pagination?: PaginationProps;
  syncURL?: SyncURLType;
  viewType?: ResultViewType;
  urlParams?: {
    q?: string;
  };
}

export type Preset = 'shopify' | undefined;

export interface AppProps {
  endpoint?: string;
  account: string;
  collection: string;
  pipeline: string | { name: string; version?: string };
  preset: Preset;
  fields?: FieldDictionary;
  filters?: (FilterProps & { field: string })[];
  defaultFilter: ContextProviderValues['defaultFilter'];
  variables: ContextProviderValues['search']['variables'];
  config: ContextProviderValues['search']['config'];
  theme: ContextProviderValues['theme'];
  options?: AppOptions;
}

export interface AppContextProps
  extends Required<Omit<AppProps, 'config' | 'endpoint' | 'fields' | 'preset' | 'theme' | 'viewType'>> {
  children?: ComponentChildren;
  filterBuilders: (RangeFilterBuilder | FilterBuilder)[];
  id: string;
}

export interface InterfaceContextProps {
  children?: ComponentChildren;
  breakpoints: Breakpoints;
  filtersShown: boolean;
  setFiltersShown: (shown: boolean) => void;
}
