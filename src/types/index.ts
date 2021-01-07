/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContextProviderValues,
  FieldDictionary,
  FilterProps,
  InputProps as CoreInputProps,
  PaginationProps,
  ResultsPerPageProps,
  ResultsProps,
  SortingProps,
} from '@sajari/react-search-ui';
import { ComponentChildren } from 'preact';

import { Breakpoints } from '../utils/styles';

export type ViewType = 'grid' | 'list';

interface InputProps extends CoreInputProps<any> {
  mode?: Exclude<CoreInputProps<any>['mode'], 'results'>;
}

export interface AppOptions {
  resultsPerPage?: ResultsPerPageProps;
  sorting?: SortingProps;
  input?: InputProps;
  results?: ResultsProps;
  pagination?: PaginationProps;
}

export type Preset = 'shopify' | undefined;

export interface AppProps {
  endpoint?: string;
  account: string;
  collection: string;
  pipeline: string | { name: string; version?: string };
  preset: Preset;
  fields?: FieldDictionary;
  filters?: FilterProps[];
  defaultFilter: ContextProviderValues['defaultFilter'];
  variables: ContextProviderValues['search']['variables'];
  config: ContextProviderValues['search']['config'];
  theme: ContextProviderValues['theme'];
  options?: AppOptions;
}

export interface AppContextProps extends Required<Omit<AppProps, 'config' | 'theme'>> {
  children?: ComponentChildren;
  id: string;
}

export interface InterfaceContextProps {
  children?: ComponentChildren;
  breakpoints: Breakpoints;
  filtersShown: boolean;
  setFiltersShown: (shown: boolean) => void;
}
