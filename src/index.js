import 'views/project'
import 'views/projects'
import home from 'views/home'
import smoothscroll from 'smoothscroll-polyfill'
import Marquee from 'components/Marquee'
import randomOf from 'utils/array-random'

for (const marquee of document.querySelectorAll('.marquee')) {
  Marquee(marquee)
}

document.addEventListener('DOMContentLoaded', () => home())

// TODO[playground]
document.getElementById('wip').addEventListener('click', e => {
  const theme = randomOf([
    '#74ffb0',
    '#1ea1ed',
    '#f9eb0b'
  ])

  const meta = document.querySelector('meta[name=theme-color]')
  meta.setAttribute('content', theme)
  document.documentElement.style.setProperty('--theme', theme)
})

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

// Force menu.article-safe visibliy when scrolling up
const articleSafeMenu = document.querySelector('.menu.article-safe')
articleSafeMenu && window.addEventListener('wheel', e => {
  articleSafeMenu.classList.toggle('is-forced-visible', e.deltaY < 0)
})
