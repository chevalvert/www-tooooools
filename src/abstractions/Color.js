import hexRgb from 'hex-rgb'
import { clamp } from 'missing-math'

const CMYK_ATTRIBUTE_PREFIX = 'data-real-cmyk-'

export default class Color {
  static get white () { return new Color('#FFFFFF', { CMYK: [0, 0, 0, 0] }) }
  static get black () { return new Color('#000000', { CMYK: [0, 0, 0, 100] }) }

  constructor (hex = '#000000', { CMYK, contrast, proof } = {}) {
    this.HEX = hex

    const { red, green, blue, alpha } = hexRgb(hex)
    this.RGB = [red, green, blue]
    this.alpha = alpha

    // Graphic designers define CMYK values on 0~100 range, but W3C defines them as 0~1 range
    this.CMYK = CMYK ? CMYK.map(v => v / 100) : null

    this.__contrast = contrast
    this.proof = this.CMYK ? (proof || computeProof(this.CMYK)) : null
  }

  get contrast () {
    this.__contrast = this.__contrast || computeContrast(this.RGB)
    return this.__contrast
  }

  // Return the raw value as an array of each component
  value (colorSpace = 'RGB') {
    return this[colorSpace]
  }

  // Return a CSS string of the color
  css (colorSpace = 'RGB') {
    if (colorSpace === 'RGB') return this.HEX || ''
    if (colorSpace === 'CMYK') return this.proof ? `rgb(${this.proof})` : ''
  }

  // Apply the color to a DOM|SVGElement, handling CMYK proof rendering
  apply ({
    element,
    attribute,
    colorSpace = 'RGB'
  }) {
    // Apply as CSS style if no attribute defined
    if (element && !attribute) {
      element.style.color = this.contrast.css(colorSpace) || this.contrast
      element.style.backgroundColor = this.css(colorSpace)
      return
    }

    // Prepare a returnable vdom ready prop object, to allow using inside JSX:
    // <Component {...Color.apply({ attribute: 'fill' })} />
    const props = { [attribute]: this.css(colorSpace) }

    // Store real CMYK value inside a temporary custom attribute, which can be
    // resolved in a later stage using Color.resolveCMYKAttributes(element)
    if (colorSpace === 'CMYK' && this.CMYK) {
      props[CMYK_ATTRIBUTE_PREFIX + attribute] = `device-cmyk(${this.CMYK})`
    }

    // Directly apply props if a an element was given
    if (element) {
      for (const attribute in props) {
        element.setAttribute(attribute, props[attribute])
      }
    }

    return props
  }

  // Resolve any attribute with real CMYK value stored via <color>.apply
  static resolveCMYKAttributes (element) {
    if (!element) return
    for (const { localName, value } of element.attributes) {
      if (!localName.startsWith(CMYK_ATTRIBUTE_PREFIX)) continue
      element.setAttribute(localName.replace(CMYK_ATTRIBUTE_PREFIX, ''), value)
      element.removeAttribute(localName)
    }
  }

  // Log function with color preview
  log (name = ' ', colorSpace) {
    console.log(
      '%c' + name,
      `
        background-color: ${this.css(colorSpace)};
        color: ${this.contrast.css(colorSpace)};
        padding: 20px;
      `,
      this
    )
  }
}

function computeContrast (rgb, threshold = 127) {
  return Math.round(((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000) <= threshold
    ? Color.white
    : Color.black
}

// SEE https://graphicdesign.stackexchange.com/a/137902
function computeProof ([c, m, y, k]) {
  const C = 255 * (1 - c)
  const M = 255 * (1 - m)
  const Y = 255 * (1 - y)
  const K = 255 * (1 - k)
  const r = 80 + 0.5882 * C - 0.3529 * M - 0.1373 * Y + 0.00185 * C * M + 0.00046 * Y * C
  const g = 66 - 0.1961 * C + 0.2745 * M - 0.0627 * Y + 0.00215 * C * M + 0.00008 * Y * C + 0.00062 * Y * M
  const b = 86 - 0.3255 * C - 0.1569 * M + 0.1647 * Y + 0.00046 * C * M + 0.00123 * Y * C + 0.00215 * Y * M
  return [r * K / 255, g * K / 255, b * K / 255]
    .map(v => Math.floor(v))
    .map(v => clamp(v, 0, 255))
}
