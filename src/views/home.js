import raf from '@internet/raf'
import Matter from 'controllers/Matter'

const view = document.getElementById('home')
view && (() => {
  // Add a `has-scrolled` class to the body once the home view is no longer visible
  view.nextElementSibling && window.addEventListener('scroll', e => {
    const { top } = view.nextElementSibling.getBoundingClientRect()
    document.body.classList.toggle('has-scrolled', top < 0)
  })

  // Apply a physic simulation on the SVG logo

  const simulation = Matter(view, {
    render: true,
    timeScale: 1,
    debug: window.location.hash === '#debug',
    mouse: true
  })

  for (const el of view.querySelectorAll('h1 svg path')) {
    const isNut = el.classList.contains('nut')
    if (isNut) {
      el.style.opacity = 0
      el.addEventListener('mouseenter', start, { once: true })
    }

    simulation.append(el, {
      isNut,
      isStatic: !isNut,
      keepAnchor: isNut,
      style: isNut && Object.assign(window.getComputedStyle(el), {
        shape: 'hex',
        angle: Math.PI / 2
      })
    })
  }

  window.addEventListener('DOMContentLoaded', () => window.setTimeout(start, 500), { once: true })

  view.addEventListener('click', e => {
    start()
    simulation.add(simulation.randomNut, [e.pageX, e.pageY])
  })

  function start () {
    if (simulation.isRunning) return

    simulation.isRunning = true
    view.classList.add('has-running-matter')
    raf.add(simulation.update)

    for (let i = 0; i < 20; i++) {
      window.setTimeout(() => {
        simulation.add(simulation.randomNut)
      }, i * (50 + Math.random() * 100))
    }
  }
})()
