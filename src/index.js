import 'views/project'
import 'views/projects'
import home from 'views/home'
import smoothscroll from 'smoothscroll-polyfill'

document.addEventListener('DOMContentLoaded', () => home())

// TODO: https://piqnt.com/planck.js/
// TODO: barba

// TODO: Run this only if polyfill is active (or if on Safari if cannot detect polyfill)
smoothscroll.polyfill()
for (const a of document.querySelectorAll('a[href^="#"]')) {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substr(1)
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth' })
  })
}

// Add a `has-scrolled` class to the body once the home view is no longer visible
const view = document.querySelector('.view:nth-child(2)')
view && window.addEventListener('scroll', e => {
  const { top } = view.getBoundingClientRect()
  document.body.classList.toggle('has-scrolled', top < 0)
})
