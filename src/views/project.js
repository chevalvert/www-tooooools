import Highlight from 'highlight.js'
import Photoswipe from 'components/dom/Photoswipe'
import Marquee from 'components/dom/Marquee'
import isMobile from 'utils/is-mobile'

const view = document.getElementById('project')
view && (() => {
  // Hydrate Marquee
  for (const marquee of view.querySelectorAll('.marquee')) Marquee(marquee)

  // Hydrate Photoswipe
  Photoswipe(view.querySelectorAll('article figure.image'))

  // Highlight code blocks
  view.querySelectorAll('pre code').forEach(el => {
    el.dataset.language = ((el.getAttribute('class') || '').match(/language-(.*)\s?/) || [])[1]
    Highlight.highlightElement(el)
  })

  if (!isMobile) {
    // Force menu.article-safe visiblity when scrolling up
    const article = document.querySelector('.menu.article-safe')
    article && window.addEventListener('wheel', e => {
      article.classList.toggle('is-forced-visible', e.deltaY < 0)
    })
  }
})()
