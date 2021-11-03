import { clamp } from 'missing-math'

const container = document.getElementById('jsProjects')
const prevProject = document.getElementById('jsPrevProject')
const nextProject = document.getElementById('jsNextProject')

if (container) {
  prevProject.addEventListener('click', e => scroll(-1))
  nextProject.addEventListener('click', e => scroll(+1))

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

  prevProject.toggleAttribute('disabled', container.scrollLeft <= 0)
  nextProject.toggleAttribute('disabled', container.scrollLeft >= container.scrollWidth - width)
}
