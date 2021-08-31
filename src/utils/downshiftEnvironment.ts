import { ContextProviderValues } from '@sajari/react-search-ui';

type DownshiftEnvironment = NonNullable<ContextProviderValues['downshiftEnvironment']>;

// https://github.com/downshift-js/downshift#environment
// https://gist.github.com/Rendez/1dd55882e9b850dd3990feefc9d6e177
export function createDownshiftEnvironment(context: ShadowRoot | HTMLIFrameElement): DownshiftEnvironment {
  const doc = context.ownerDocument;
  const properties: DownshiftEnvironment = {
    document: doc,
    addEventListener: doc.addEventListener.bind(context),
    removeEventListener: doc.removeEventListener.bind(context),
  };

  return new Proxy(context, {
    get: (_, prop: keyof DownshiftEnvironment) => properties[prop],
  }) as unknown as DownshiftEnvironment;
}
