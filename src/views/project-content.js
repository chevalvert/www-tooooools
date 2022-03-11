import Highlight from 'highlight.js'
import Photoswipe from 'components/dom/Photoswipe'

const view = document.getElementById('project-content')
view && (() => {
  Photoswipe(view.querySelectorAll('article figure.image'))

  view.querySelectorAll('pre code').forEach(el => {
    el.dataset.language = ((el.getAttribute('class') || '').match(/language-(.*)\s?/) || [])[1]
    Highlight.highlightElement(el)
  })

  // Force menu.article-safe visiblity when scrolling up
  const article = document.querySelector('.menu.article-safe')
  article && window.addEventListener('wheel', e => {
    article.classList.toggle('is-forced-visible', e.deltaY < 0)
  })
})()
