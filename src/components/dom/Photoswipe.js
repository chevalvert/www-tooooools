import PhotoSwipe from 'photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
import isMobile from 'utils/is-mobile'

const OPTIONS = {
  bgOpacity: 1,
  history: false,
  allowPanToNext: false,
  barsSize: { top: 22, bottom: 'auto' },
  captionEl: false,
  fullscreenEl: false,
  closeEl: true,
  zoomEl: false,
  shareEl: false,
  counterEl: false,
  preloaderEl: false,
  showHideOpacity: true,
  timeToIdle: null,
  timeToIdleOutside: null,
  tapToToggleControls: false,
  maxSpreadZoom: isMobile ? 2 : 1,
  pinchToClose: isMobile,
  getDoubleTapZoom: (isMouseClick, item) => isMobile
    ? (item.initialZoomLevel < 0.7 ? 1 : 1.5)
    : item.initialZoomLevel
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
      Object.assign({}, OPTIONS, { index })
    )

    photoswipe.init()
  }
}
