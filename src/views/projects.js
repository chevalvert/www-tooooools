import { clamp } from 'missing-math'

const view = document.getElementById('projects')
view && (() => {
  const container = document.getElementById('jsProjects')
  const prevButtons = container.querySelectorAll('[data-action=prev]')
  const nextButtons = container.querySelectorAll('[data-action=next]')

  if (container) {
    for (const prev of prevButtons) prev.addEventListener('click', e => scroll(-1))
    for (const next of nextButtons) next.addEventListener('click', e => scroll(+1))

    window.addEventListener('DOMContentLoaded', e => scroll())
    container.addEventListener('scroll', e => scroll())
  }

  function scroll (direction) {
    const { width } = container.getBoundingClientRect()

    if (direction) {
      container.scrollLeft = clamp(
        container.scrollLeft + Math.sign(direction) * width,
        0,
        container.scrollWidth
      )
    }

    for (const prev of prevButtons) prev.toggleAttribute('disabled', container.scrollLeft <= 0)
    for (const next of nextButtons) next.toggleAttribute('disabled', container.scrollLeft >= container.scrollWidth - width)
  }
})()
