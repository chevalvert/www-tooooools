import { Path } from 'opentype.js'
import Rectangle from 'abstractions/Rectangle'

export default class BoundingBox {
  static validate (bbox) {
    return !Object.values(bbox).some(v => isNaN(v))
  }

  constructor ({ xmin, xmax, ymin, ymax }) {
    if (!BoundingBox.validate({ xmin, xmax, ymin, ymax })) {
      throw new Error('Bounding box malformation: expected input is `{ xmin, xmax, ymin, ymax }`')
    }

    this.xmin = xmin
    this.xmax = xmax
    this.ymin = ymin
    this.ymax = ymax
  }

  get width () { return Math.abs(this.xmax - this.xmin) }
  get height () { return Math.abs(this.ymax - this.ymin) }
  get ratio () { return this.width / this.height }
  get center () { return [this.xmin + this.width / 2, this.ymin + this.height / 2] }
  get rectangle () {
    return new Rectangle({
      x: this.xmin,
      y: this.ymin,
      width: this.width,
      height: this.height
    })
  }

  static fromOpentypePath (path) {
    if (!(path instanceof Path)) {
      throw new TypeError('Path should be a valid Opentype.Path instance')
    }

    const { x1: xmin, x2: xmax, y1: ymin, y2: ymax } = path.getBoundingBox()
    return new BoundingBox({ xmin, xmax, ymin, ymax })
  }

  static fromBBoxArray (bboxes = []) {
    let xmin = Number.POSITIVE_INFINITY
    let ymin = Number.POSITIVE_INFINITY
    let xmax = Number.NEGATIVE_INFINITY
    let ymax = Number.NEGATIVE_INFINITY

    bboxes.forEach(bbox => {
      if (!bbox) return
      if (bbox.xmin < xmin) xmin = bbox.xmin
      if (bbox.ymin < ymin) ymin = bbox.ymin
      if (bbox.xmax > xmax) xmax = bbox.xmax
      if (bbox.ymax > ymax) ymax = bbox.ymax
    })

    return new BoundingBox({ xmin, xmax, ymin, ymax })
  }

  static fromRectangle (rectangle) {
    return new BoundingBox({
      xmin: rectangle.x,
      xmax: rectangle.x + rectangle.width,
      ymin: rectangle.y,
      ymax: rectangle.y + rectangle.height
    })
  }

  static empty (x = 0, y = 0) {
    return new BoundingBox({ xmin: x, ymin: y, xmax: x, ymax: y })
  }

  clone ({ xmin = this.xmin, ymin = this.ymin, xmax = this.xmax, ymax = this.ymax } = {}) {
    return new BoundingBox({ xmin, xmax, ymin, ymax })
  }

  intersects (bbox, { boundaryCollisions = false } = {}) {
    if (!(bbox instanceof BoundingBox)) {
      throw new TypeError('Cannot check the intersection to a non BoundingBox instance')
    }

    return boundaryCollisions
      ? !(bbox.xmin > this.xmax || bbox.xmax < this.xmin || bbox.ymin > this.ymax || bbox.ymax < this.ymin)
      : !(bbox.xmin >= this.xmax || bbox.xmax <= this.xmin || bbox.ymin >= this.ymax || bbox.ymax <= this.ymin)
  }

  // Test if BoundingBox is fully inside another bbox instance
  inside (bbox, { axis = null } = {}) {
    switch (axis) {
      case 'x': return this.xmin >= bbox.xmin && this.xmax <= bbox.xmax
      case 'y': return this.ymin >= bbox.ymin && this.ymax <= bbox.ymax
      default:
        return this.xmin >= bbox.xmin && this.xmax <= bbox.xmax && this.ymin >= bbox.ymin && this.ymax <= bbox.ymax
    }
  }

  translate (x = 0, y = 0, { clone = false } = {}) {
    const bbox = clone ? this.clone() : this
    bbox.xmin += x
    bbox.xmax += x
    bbox.ymin += y
    bbox.ymax += y
    return bbox
  }

  scale (x = 1, y = 1, { clone = false } = {}) {
    const bbox = clone ? this.clone() : this
    bbox.xmax = bbox.xmin + bbox.width * x
    bbox.ymax = bbox.ymin + bbox.height * y

    if (bbox.xmax < bbox.xmin) {
      const temp = bbox.xmin
      bbox.xmin = bbox.xmax
      bbox.xmax = temp
    }

    if (bbox.ymax < bbox.ymin) {
      const temp = bbox.ymin
      bbox.ymin = bbox.ymax
      bbox.ymax = temp
    }

    return bbox
  }

  vnode (props = {}) {
    return (
      <rect
        x={isFinite(this.xmin) ? this.xmin : Math.max(0, (Math.sign(this.xmin) * 100)) + '%'}
        y={isFinite(this.ymin) ? this.ymin : Math.max(0, (Math.sign(this.ymin) * 100)) + '%'}
        width={isFinite(this.width) ? this.width : (Math.sign(this.width) * 100) + '%'}
        height={isFinite(this.height) ? this.height : (Math.sign(this.height) * 100) + '%'}
        {...props}
      />
    )
  }
}
