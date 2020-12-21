import 'twin.macro';

import styledImport, { css as cssImport, CSSProp } from 'styled-components';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module 'preact' {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CSSProp;
    }
  }
  interface Attributes {
    css?: CSSProp;
  }
}

// The 'as' prop on styled components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string;
    }
  }
}
