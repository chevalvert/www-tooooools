import 'views/home'
import 'views/keywords'
import 'views/playground'
import 'views/project'
import 'views/projects'

import lozad from 'lozad'
import smoothscroll from 'smoothscroll-polyfill'

// Lazyloading
const lazys = document.querySelectorAll('[data-lazyload=true]')
// Lozad set a [data-loaded] attribute when loading ressources, but does not
// detect when ressource is fully loaded, which can cause incoherent animations
for (const lazy of lazys) lazy.onload = () => lazy.setAttribute('data-decoded', true)
const observer = lozad(lazys)
observer.observe()

// Anchors smooth scroll
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
