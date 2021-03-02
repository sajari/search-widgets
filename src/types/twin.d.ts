import 'twin.macro';

import styledImport from '@emotion/styled';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
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
