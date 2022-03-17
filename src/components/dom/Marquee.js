import raf from '@internet/raf'

export default function (element) {
  let x = 0
  const offset = parseFloat(element.dataset.offset || 0)
  const speed = 1e-4 + (1e-4 * (1 - offset))
  const direction = -1

  raf.add(update)

  function update (dt) {
    if ((x += speed) > 0.5) x = 0

    const v = ((x + offset) * 100) % 50
    element.style.setProperty('--offset-x', (v * direction).toFixed(3) + '%')
  }
}
