import distSq from 'utils/distance-squared'
import isMobile from 'utils/is-mobile'

export default function (element, container = window) {
  element.classList.add('button')

  if (isMobile) return
  container.addEventListener('mousemove', handleMouse)

  function handleMouse (e) {
    window.requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect()
      rect.center = [
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      ]

      const d = distSq([e.clientX, e.clientY], rect.center)
      const threshold = Math.pow(rect.width, 2)
      const hit = d < threshold
      const factor = hit ? 0.3 : 0
      const dx = (e.clientX - rect.center[0]) * factor
      const dy = (e.clientY - rect.center[1]) * factor

      element.classList.toggle('is-sticked', hit)
      element.style.setProperty('--offset-x', Math.floor(dx) + 'px')
      element.style.setProperty('--offset-y', Math.floor(dy) + 'px')
    })
  }
}
