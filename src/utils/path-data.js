export default function (arr, { offx = 0, offy = 0, scale = 1, decimals = 3 } = {}) {
  let d = ''
  for (let i = 0; i < arr.length + 1; i++) {
    d += i ? ' L ' : 'M '
    d += ((arr[i % arr.length][0] + offx) * scale).toFixed(decimals) + ' ' + ((arr[i % arr.length][1] + offy) * scale).toFixed(decimals)
  }
  return d
}
