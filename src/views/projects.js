import Splide from '@splidejs/splide'
import { Intersection } from '@splidejs/splide-extension-intersection'

const view = document.getElementById('projects')
view && (() => {
  const splide = new Splide('.splide', {
    type: 'fade',
    arrows: false,
    waitForTransition: false,
    intersection: {
      inView: { keyboard: true },
      outView: { keyboard: false }
    }
  })
  splide.mount({ Intersection })

  const prevButtons = view.querySelectorAll('[data-action=prev]')
  const nextButtons = view.querySelectorAll('[data-action=next]')
  const jumpButtons = view.querySelectorAll('[data-action=jump]')

  for (const prev of prevButtons) prev.addEventListener('click', e => splide.go('<'))
  for (const next of nextButtons) next.addEventListener('click', e => splide.go('>'))
  for (const jump of jumpButtons) jump.addEventListener('click', e => splide.go(+jump.dataset.index))
})()
