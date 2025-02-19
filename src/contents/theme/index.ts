import type { PlasmoCSConfig } from 'plasmo';
import { observe } from 'selector-observer';
import './styles.scss';

// remove banners and promotions
observe('.c-banner', {
  add: (el) => {
    el.remove();
  },
});
observe('.banner', {
  add: (el) => {
    el.classList.remove('banner');
    document.body.classList.remove('promo');
  },
});

// alter element classnames
const classNamesMap = {
  'u-color-js-gray': '__JSDX_link_gray',
  'u-color-js-gray-alt-light': '__JSDX_link_gray_alt',
};
for (const [source, target] of Object.entries(classNamesMap)) {
  observe(`.${source}`, {
    add: (el) => {
      el.classList.remove(source);
      el.classList.add(target);
    },
  });
}

export const config: PlasmoCSConfig = {
  matches: ['https://jiosaavn.com/*', 'https://www.jiosaavn.com/*'],
};
