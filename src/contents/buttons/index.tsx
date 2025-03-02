import type { PlasmoCSConfig } from 'plasmo';
import { createRoot } from 'react-dom/client';
import { observe } from 'selector-observer';
import { Button } from './button';
import './styles.css';

export const config: PlasmoCSConfig = {
  matches: ['https://jiosaavn.com/*', 'https://www.jiosaavn.com/*'],
};

// song download button from list
observe(`.c-content ol.o-list-bare li article.o-snippet > div.o-snippet__item:nth-last-of-type(2)`, {
  add: (el: HTMLDivElement) => {
    // get to parent node and look for the song id token
    const parent = el.parentElement;
    const pathname = parent.querySelector('figcaption h4 a')?.getAttribute('href');
    const token = pathname?.match(/.*song\/.*\/(.*)$/)?.[1];
    // break if already injected
    if (parent.hasAttribute('data-jsdx-mounted')) return;
    // inject the download button
    const wrapper = document.createElement('div');
    wrapper.className = 'o-snippet__item u-align-center';
    el.before(wrapper);
    parent.setAttribute('data-jsdx-mounted', '');
    // break if song is not available
    if (!el.hasChildNodes()) return;
    // render the button
    createRoot(wrapper).render(<Button token={token} size="small" target="song" />);
  },
});

// song download button from singles
observe('#root > .song figure .o-layout > .o-layout__item:first-of-type', {
  add: (el) => {
    // get to parent node and look for the song id token
    const parent = el.parentElement;
    const pathname = new URL(window.location.href).pathname;
    const token = pathname.match(/.*song\/.*\/(.*)$/)?.[1];
    // if button already injected, exit function
    if (parent.hasAttribute('data-jsdx-mounted')) return;
    // inject the download button
    const wrapper = document.createElement('p');
    wrapper.className = 'o-layout__item u-margin-bottom-none@sm';
    el.after(wrapper);
    parent.setAttribute('data-jsdx-mounted', '');
    // render the button
    createRoot(wrapper).render(<Button token={token} size="large" target="song" />);
  },
});

// album/playlist download button
const typeFlagMap = {
  featured: 'playlist',
  s: 'playlist',
  album: 'album',
};
observe('#root > div:where(.featured,.s,.album) figure .o-layout > .o-layout__item:first-of-type', {
  add: (el) => {
    // get to parent node and look for the song id token
    const parent = el.parentElement;
    const pathname = new URL(window.location.href).pathname;
    const [, pageSlugParam, token] = pathname.match(/^\/([^/]+)\/.*\/([^/]+)$/);
    const type = pageSlugParam in typeFlagMap ? typeFlagMap[pageSlugParam] : null;
    // if button already injected, exit function
    if (!token || !type || parent.hasAttribute('data-jsdx-mounted')) return;
    // inject the download button
    const wrapper = document.createElement('p');
    wrapper.className = 'o-layout__item u-margin-bottom-none@sm';
    el.after(wrapper);
    parent.setAttribute('data-jsdx-mounted', '');
    // render the button
    createRoot(wrapper).render(<Button token={token} size="large" target={type} />);
  },
});
