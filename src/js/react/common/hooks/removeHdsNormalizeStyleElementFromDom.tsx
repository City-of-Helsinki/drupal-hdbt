import { useLayoutEffect } from 'react';

const removeHdsNormalizeStyleElementFromDom = () => {
  useLayoutEffect(() => {
    const styleElements = document.querySelectorAll('style');
    Object.keys(styleElements).forEach((key: any) => {
      if (styleElements[key].innerHTML.startsWith('/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */')) {
        styleElements[key].remove();
      }
    });
  });
};

export default removeHdsNormalizeStyleElementFromDom;
