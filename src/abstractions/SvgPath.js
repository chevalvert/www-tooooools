import parse from 'parse-svg-path'
import abs from 'abs-svg-path'
import norm from 'normalize-svg-path'
import serialize from 'serialize-svg-path'
import bbox from 'svg-path-bbox'

import { normalize } from 'missing-math'

const SVGNS = 'http://www.w3.org/2000/svg'

export default class SvgPath {
  constructor (d) {
    this.el = document.createElementNS(SVGNS, 'path')
    this.el.setAttribute('d', d)
    this.totalLength = this.el.getTotalLength()

    this.raw = d
    this.data = norm(abs(parse(d)))
    this.boundingBox = bbox(this.raw)
  }

  getPosition (t, norm = false) {
    const { x, y } = this.el.getPointAtLength(t * this.totalLength)
    return norm ? [
      normalize(x, this.boundingBox[0], this.boundingBox[2]),
      normalize(y, this.boundingBox[1], this.boundingBox[3])
    ] : [x, y]
  }

  toString () {
    return serialize(this.data)
  }
}
