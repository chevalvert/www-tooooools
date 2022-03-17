import { clamp } from 'missing-math'

const view = document.getElementById('projects')
view && (() => {
  const scrollContainer = view.querySelector('ul.projects')
  const prevButtons = scrollContainer.querySelectorAll('[data-action=prev]')
  const nextButtons = scrollContainer.querySelectorAll('[data-action=next]')
  const jumpButtons = scrollContainer.querySelectorAll('[data-action=jump]')

  for (const prev of prevButtons) prev.addEventListener('click', e => scroll(-1))
  for (const next of nextButtons) next.addEventListener('click', e => scroll(+1))
  for (const jump of jumpButtons) jump.addEventListener('click', e => goTo(jump.dataset.index))

  function goTo (index) {
    const { width } = scrollContainer.getBoundingClientRect()
    console.log(index, width, width * index)
    scrollContainer.scrollLeft = width * index
  }

  function scroll (direction) {
    const { width } = scrollContainer.getBoundingClientRect()

    scrollContainer.scrollLeft = clamp(
      scrollContainer.scrollLeft + Math.sign(direction) * width,
      0,
      scrollContainer.scrollWidth
    )
  }
})()
