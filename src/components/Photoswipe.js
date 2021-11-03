import PhotoSwipe from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'

const OPTIONS = {
  bgOpacity: 1,
  history: false,
  allowPanToNext: false,
  barsSize: { top: 0, bottom: 'auto' },
  captionEl: true,
  fullscreenEl: false,
  zoomEl: false,
  shareEl: false,
  counterEl: true,
  preloaderEl: true,
  showHideOpacity: true
}

export default function (figures = []) {
  const container = document.querySelector('.pswp')
  let photoswipe
  const slides = []

  figures.forEach((figure, index) => {
    const img = figure.querySelector('img')
    if (!img) return

    figure.classList.add('has-photoswipe')
    const figcaption = figure.querySelector('figcaption')
    const a = (figure.parentNode.tagName === 'A') && figure.parentNode

    slides.push({
      index,
      element: img,
      title: figcaption && figcaption.innerHTML,
      src: a ? a.getAttribute('href') : img.getAttribute('data-zoom-src'),
      w: +img.getAttribute('data-width'),
      h: +img.getAttribute('data-height')
    })

    ;(a || figure).addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      open(index)
    })
  })

  function open (index = 0) {
    photoswipe = new PhotoSwipe(
      container,
      PhotoSwipeUIDefault,
      slides,
      Object.assign({}, OPTIONS, { index, getThumbBoundsFn })
    )

    photoswipe.init()
  }

  function getThumbBoundsFn (index) {
    const slide = slides[index]
    if (!slide) return

    const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
    const { left, top, width } = slide.element.getBoundingClientRect()
    return {
      x: left,
      y: top + pageYScroll,
      w: width
    }
  }
}
