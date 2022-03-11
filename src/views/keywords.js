import Marquee from 'components/dom/Marquee'

const view = document.getElementById('keywords')
view && (() => {
  for (const marquee of document.querySelectorAll('.marquee')) Marquee(marquee)
})()
