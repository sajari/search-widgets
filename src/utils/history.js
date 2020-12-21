/*
import is from './is';
import { parseUrl } from './url';

const { facets } = env;
const params = {
  query: 'q',
  page: 'p',
  pageSize: 'ps',
  sort: 's',
};
const arraySeparator = '|';
const historySupported =
  typeof window !== 'undefined' && window.history && typeof window.history.pushState === 'function';

export function parseStateFromUrl({ defaults }) {
  if (!window.location) {
    return {};
  }

  const url = parseUrl(window.location.href);

  if (!url) {
    return null;
  }

  const state = Object.entries({ ...params, ...facets.map((f) => f.field) })
    .filter(([, param]) => url.searchParams.has(param))
    .reduce(
      (state, [prop, param]) => {
        const value = url.searchParams.get(param);

        // Filters are flattened into the URL
        if (facets.some((f) => f.field === param)) {
          state.filters[param] = value?.split(arraySeparator);
          return state;
        }

        switch (param) {
          case params.page:
          case params.pageSize:
            state[prop] = Number(value);
            break;

          default:
            state[prop] = value;
        }

        return state;
      },
      { ...defaults, filters: {} },
    );

  return state;
}

export function setStateToUrl({ state, replace, defaults }) {
  if (!historySupported || !window.location) {
    return;
  }

  const url = parseUrl(window.location.href);

  if (!url) {
    return;
  }

  const { filters, page, pageSize, query, sort } = state;
  const data = {
    query,
    page,
    pageSize,
    sort,
    ...facets.reduce((out, { field }) => Object.assign(out, { [field]: filters[field] }), {}),
  };

  Object.entries(data).forEach(([key, value]) => {
    const param = Object.keys(params).includes(key) ? params[key] : key;
    const isDefault = value === defaults[key];

    if (isDefault || is.empty(value)) {
      url.searchParams.delete(param);
    } else {
      url.searchParams.set(param, is.array(value) ? value.join(arraySeparator) : value);
    }
  });

  // Update state
  window.history[replace ? 'replaceState' : 'pushState'](null, null, `${url.pathname}${url.search}${url.hash}`);
}
*/
