import { load as loadOpenType } from 'opentype.js'
import { render } from 'utils/jsx'
import { readable, writable } from 'utils/state'
import { Signal } from 'utils/state/signal'
import randomOf from 'utils/array-random'

import Button from 'components/dom/Button'
import Paper from 'components/dom/Paper'
import Store from 'controllers/PlaygroundStore'
import APIServer from 'controllers/APIServer'

const view = document.getElementById('playground')
view && (async () => {
  let paper = null

  // Start APIServer
  APIServer.polling.start()

  // Preload Opentype fonts
  for (const id in Store.fonts.get()) {
    Store.fonts.current[id] = await new Promise(resolve => {
      loadOpenType(Store.fonts.current[id], (error, font) => {
        if (error) throw error
        font.id = id
        resolve(font)
      })
    })
  }

  // Build the Store signals based on found [data-signal] inputs in the view
  for (const key in Store) {
    const value = Store[key]
    if (value instanceof Signal) continue

    const isArray = Array.isArray(value)
    const isFunction = (value instanceof Function)
    const input = view.querySelector(`[data-signal=${key}], [data-action=${key}]`)
    const isButton = input && input.tagName === 'BUTTON'

    if (!input) {
      // Assign random value if no input found
      if (!isFunction) {
        Store[key] = readable(isArray ? randomOf(value) : value)
      }
      continue
    }

    // Mutate Store property into a signal
    if (input.hasAttribute('data-signal')) {
      Store[key] = writable(isArray ? value[0] : value)
    }

    // Keep track of input element
    Store[key].input = input

    // Hydrate the element with the Button component
    Button(input, view)

    let index = 0
    if (!isArray && !isButton) input.checked = value
    input.addEventListener(isButton ? 'click' : 'input', async () => {
      // Run the Store function
      if (input.hasAttribute('data-action')) {
        input.classList.add('is-loading')
        await value(paper)
        input.classList.remove('is-loading')
        return
      }

      // Update value either by iterating through an array or change value
      if (input.hasAttribute('data-signal')) {
        Store[key].set(isArray
          ? value[++index % value.length]
          : input.checked
        )
      }
    })
  }

  // Render a <Paper> component with built Store
  paper = render(<Paper {...Store} />, view.querySelector('.playground__preview')).components[0]

  // Compensate view height changes due to format changes, to ensure clicked
  // buttons stays at same y coordinate
  window.requestAnimationFrame(() => {
    const text = view.querySelector('.playground__ui')
    let py = text.offsetTop

    window.addEventListener('resize', () => { py = text.offsetTop })

    Store.format.subscribe(() => {
      window.requestAnimationFrame(() => {
        const y = text.offsetTop
        const d = y - py
        document.documentElement.scrollTop += d
        py = y
      })
    })
  })

  // SEE playground.scss
  window.requestAnimationFrame(() => {
    const el = view.querySelector('.playground-paper__format')
    if (!el) return
    view.style.setProperty('--format-height', el.offsetHeight + 'px')
    Store.format.subscribe(() => {
      window.requestAnimationFrame(() => view.style.setProperty('--format-height', el.offsetHeight + 'px'))
    })
  })

  // Update page theme on color change
  Store.color && Store.color.subscribe && Store.color.subscribe(color => {
    const meta = document.querySelector('meta[name=theme-color]')
    if (meta) meta.content = color.HEX
    document.documentElement.style.setProperty('--theme', color.HEX)
  })
})()
