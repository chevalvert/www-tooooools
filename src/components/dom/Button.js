import distSq from 'utils/distance-squared'

export default function (element, container = window) {
  // TODO: skip on no pointer devices

  element.classList.add('button')
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

      element.classList.toggle('is-hover', hit)
      // TODO: round to 2px on non retina to avoid blur ?
      element.style.setProperty('--offset-x', Math.floor(dx) + 'px')
      element.style.setProperty('--offset-y', Math.floor(dy) + 'px')
    })
  }
}
