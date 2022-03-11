import Marquee from 'components/dom/Marquee'

const view = document.getElementById('project-info')
view && (() => {
  for (const marquee of document.querySelectorAll('.marquee')) Marquee(marquee)
})()

