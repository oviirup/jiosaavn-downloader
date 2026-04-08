import type { PlasmoCSConfig } from 'plasmo'
import { createRoot } from 'react-dom/client'
import { observe } from 'selector-observer'
import { renderButton } from './button'
import './styles.css'

export const config: PlasmoCSConfig = {
  matches: ['https://jiosaavn.com/*', 'https://www.jiosaavn.com/*'],
}

// song download button from list
observe(
  `.c-content ol li article.o-snippet:has(>.o-snippet__item>.o-flag>.o-flag__body>div>a)`,
  (el) => {
    const link = el.querySelector('.o-flag__body>div>a')!
    const href = link.getAttribute('href')
    const token = href?.match(/.*song\/.*\/(.*)$/)?.[1]
    if (!token) {
      console.error('JSDX Unable to extract the token')
      return
    }
    // break if already injected
    if (el.hasAttribute('data-jsx-mounted')) return
    // inject the download button
    const fabButton = el.querySelector('.o-snippet__item:nth-last-child(2)')
    const wrapper = document.createElement('div')
    wrapper.className = 'o-snippet__item u-align-center'
    fabButton.before(wrapper)
    el.setAttribute('data-jsx-mounted', '')
    // render the button
    try {
      const btn = renderButton({ token, size: 'small', target: 'song' })
      createRoot(wrapper).render(btn)
    } catch {
      console.error('JSDX Error rendering download button')
    }
  },
)

// song download button from singles
observe('#root > .song figure .o-layout > .o-layout__item:first-of-type', {
  add: (el) => {
    // get to parent node and look for the song id token
    const parent = el.parentElement
    const pathname = new URL(window.location.href).pathname
    const token = pathname.match(/.*song\/.*\/(.*)$/)?.[1]
    // if button already injected, exit function
    if (parent.hasAttribute('data-jsdx-mounted')) return
    // inject the download button
    const wrapper = document.createElement('p')
    wrapper.className = 'o-layout__item u-margin-bottom-none@sm'
    el.after(wrapper)
    parent.setAttribute('data-jsdx-mounted', '')

    // render the button
    try {
      const btn = renderButton({ token, size: 'large', target: 'song' })
      createRoot(wrapper).render(btn)
    } catch {
      console.error('JSDX Error rendering download button')
    }
  },
})

// album/playlist download button
const typeFlagMap = {
  featured: 'playlist',
  s: 'playlist',
  album: 'album',
}
observe(
  '#root > div:where(.featured,.s,.album) figure .o-layout > .o-layout__item:first-of-type',
  {
    add: (el) => {
      // get to parent node and look for the song id token
      const parent = el.parentElement
      const pathname = new URL(window.location.href).pathname
      const [, param, token] = pathname.match(/^\/([^/]+)\/.*\/([^/]+)$/)
      const type = param in typeFlagMap ? typeFlagMap[param] : null
      // if button already injected, exit function
      if (!token || !type || parent.hasAttribute('data-jsdx-mounted')) return
      // inject the download button
      const wrapper = document.createElement('p')
      wrapper.className = 'o-layout__item u-margin-bottom-none@sm'
      el.after(wrapper)
      parent.setAttribute('data-jsdx-mounted', '')

      // render the button
      try {
        const btn = renderButton({ token, size: 'large', target: type })
        createRoot(wrapper).render(btn)
      } catch {
        console.error('JSDX Error rendering download button')
      }
    },
  },
)
