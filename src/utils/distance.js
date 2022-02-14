export const distanceSq = ([x1, y1], [x2, y2]) => {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

export const distance = (a, b) => Math.sqrt(distanceSq(a, b))

export default { distance, distanceSq}
