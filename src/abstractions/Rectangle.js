export default class Rectangle {
  static validate (rectangle) {
    if (rectangle instanceof Rectangle) return rectangle
    throw new TypeError(`Expected a Rectangle instance, got ${rectangle}`)
  }

  constructor ({
    x,
    y,
    origin = 'NW', // NW|NE|SE|SW
    width,
    height,
    ratio,
    maxWidth = Number.POSITIVE_INFINITY,
    maxHeight = Number.POSITIVE_INFINITY
  } = {}) {
    this.x = x
    this.y = y
    this.origin = origin.toUpperCase()

    this.ratio = ratio
    this.width = width
    this.height = height

    this.maxWidth = maxWidth
    this.maxHeight = maxHeight

    if (!this.width && this.ratio) this.width = this.height * this.ratio
    if (!this.height && this.ratio) this.height = this.width / this.ratio

    if (!this.width || !this.height) return

    switch (this.origin) {
      case 'NW': break
      case 'NE':
        this.x -= this.width
        break
      case 'SE':
        this.x -= this.width
        this.y -= this.height
        break
      case 'SW':
        this.y -= this.height
        break
    }
  }

  static fromBBox (bbox) {
    return new Rectangle({
      x: bbox.xmin,
      y: bbox.ymin,
      width: bbox.width,
      height: bbox.height
    })
  }

  set width (width) { this._width = width }
  get width () { return this.maxWidth ? Math.min(this._width, this.maxWidth) : this._width }

  set height (height) { this._height = height }
  get height () { return this.maxHeight ? Math.min(this._height, this.maxHeight) : this._height }

  get left () { return this.x }
  get right () { return this.x + this.width }
  get top () { return this.y }
  get bottom () { return this.y + this.height }

  clone ({
    x = this.x,
    y = this.y,
    origin = this.origin,
    width = this._width,
    height = this._height,
    ratio = this.ratio,
    maxWidth = this.maxWidth,
    maxHeight = this.maxHeight
  } = {}) {
    return new Rectangle({ origin, x, y, width, height, ratio, maxWidth, maxHeight })
  }

  expand (value = 0) {
    this.x -= value
    this.y -= value
    this.width += value * 2
    this.height += value * 2

    return this
  }

  vnode (props = {}) {
    return isFinite(this.width)
      ? isFinite(this.height)
        ? <rect x={this.x} y={this.y} width={this.width} height={this.height} {...props} />
        : <line x1={this.x} x2={this.x + this.width} y1={this.y} y2={this.y} {...props} />
      : isFinite(this.height)
        ? <line x1={this.x} x2={this.x} y1={this.y} y2={this.height} {...props} />
        : null
  }
}
