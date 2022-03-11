import * as Opentype from 'opentype.js'
import { render } from 'utils/jsx'
import { readable, writable } from 'utils/state'
import { Signal } from 'utils/state/signal'
import randomOf from 'utils/array-random'

import Button from 'components/dom/Button'
import PlaygroundPoster from 'components/dom/PlaygroundPoster'
import Store from 'controllers/PlaygroundStore'

const view = document.getElementById('playground')
view && (async () => {
  // Preload Opentype fonts
  for (const id in Store.fonts.get()) {
    Store.fonts.current[id] = await new Promise(resolve => {
      Opentype.load(Store.fonts.current[id], (error, font) => {
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
    const input = view.querySelector(`[data-signal=${key}], [data-action=${key}]`)
    const isButton = input && input.tagName === 'BUTTON'

    // Assign random value if no input found
    if (!input) {
      Store[key] = readable(isArray ? randomOf(value) : value)
      continue
    }

    // Hydrate the element with the Button component
    Button(input, view)

    // Assign default value
    Store[key] = writable(isArray ? value[0] : value)

    // Update value either by iterating through an array or change value
    let index = 0
    if (!isArray && !isButton) input.checked = value
    input.addEventListener(isButton ? 'click' : 'input', () => {
      Store[key].set(isArray
        ? value[++index % value.length]
        : input.checked
      )
    })
  }

  // Render a <PlaygroundPoster> component with built Store
  render(<PlaygroundPoster {...Store} />, view.querySelector('.view__content'))

  // Update page theme on color change
  Store.color && Store.color.subscribe && Store.color.subscribe(hex => {
    const meta = document.querySelector('meta[name=theme-color]')
    if (meta) meta.content = hex
    document.documentElement.style.setProperty('--theme', hex)
  })
})()
