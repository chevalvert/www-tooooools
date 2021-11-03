import Highlight from 'highlight.js'
import Photoswipe from 'components/Photoswipe'

Photoswipe(document.querySelectorAll('article figure.image'))

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach(el => {
    el.dataset.language = ((el.getAttribute('class') || '').match(/language-(.*)\s?/) || [])[1]
    Highlight.highlightElement(el)
  })
})
