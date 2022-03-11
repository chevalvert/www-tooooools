import 'views/home'
import 'views/keywords'
import 'views/playground'
import 'views/project-content'
import 'views/project-info'
import 'views/projects'

import smoothscroll from 'smoothscroll-polyfill'

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
