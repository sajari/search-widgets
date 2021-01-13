export default function getSearchParams() {
  if (typeof window !== 'undefined') {
    const search: Record<string, string> = {};

    new URLSearchParams(window.location.search).forEach((value, key) => {
      search[key] = value;
    });

    return search;
  }

  return {};
}
