import Preact from 'preact';
import { createContext as create, useContext as use } from 'preact/compat';

type CreateContextReturn<T> = [Preact.Provider<T>, () => T, Preact.Context<T>];

interface CreateContextOptions {
  /** If `true`, React will throw if context is `null` or `undefined`.
      In some cases, you might want to support nested context, so you can set it to `false` */
  strict?: boolean;
  /** Error message to throw if the context is `undefined` */
  errorMessage?: string;
  /** The display name of the context */
  name?: string;
}

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const { strict = true, errorMessage = 'useContext must be inside a Provider with a value', name } = options;
  const Context = create<ContextType | undefined>(undefined);

  // @ts-ignore
  Context.displayName = name;

  function useContext() {
    const context = use(Context);
    if (!context && strict) {
      throw new Error(errorMessage);
    }
    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<ContextType>;
}
