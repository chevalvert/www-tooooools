import { Component } from 'utils/jsx'
import { readable } from 'utils/state'
import classnames from 'classnames'

import BoundingBox from 'abstractions/BoundingBox'
import Rectangle from 'abstractions/Rectangle'
import WrappableText from 'wrappable-text'

import Text from 'components/svg/Text'
import lastOf from 'utils/array-last'

const CACHE = new Map()
const cachableMeasure = (font, fontFamily, fontSize) => string => {
  const id = `${fontFamily}__${fontSize}__${string}`
  if (CACHE.has(id)) return CACHE.get(id)
  const value = font.getAdvanceWidth(string, fontSize)
  CACHE.set(id, value)
  return value
}

export default class Paragraph extends Component {
  beforeRender ({
    x = 0,
    y = 0,
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
    origin = 'NW', // SEE abstractions/Rectangle

    font = null,
    fontSize = 72,
    lineGap = 1.3, // em
    verticalOffset = -0.28, // em

    textAlign = 'left',
    nowrap = false
  } = {}) {
    if (!font) throw new Error('An opentype.js font object is required as `font` prop')

    const rectangle = new Rectangle({ x, y, width, height, origin })
    const text = new WrappableText((this.props.children.join('') || '').trim(), {
      measure: cachableMeasure(font, font.id, fontSize)
    })

    const { lines, overflow } = text[nowrap ? 'nowrap' : 'wrap'](rectangle.width)

    this.state = {
      text,
      lines,
      rectangle,

      hasOverflow: readable(overflow), // SEE derived below
      isWrapped: readable(!nowrap),

      font,
      fontSize,
      lineGap,
      verticalOffset,
      textAlign: textAlign,

      bbox: undefined // SEE afterRender
    }
  }

  template (props, state) {
    const { x, y: ystart, width, height, origin } = state.rectangle
    if (!state.lines || !state.lines.length) return

    const offy = state.verticalOffset * state.fontSize
    const lines = state.lines.map((line, index) => (
      <Text
        x={
          state.textAlign === 'right'
            ? x + width - line.width
            : state.textAlign === 'center'
              ? x + width / 2 - line.width / 2
              : x
        }
        y={ystart + offy + (index + 1) * state.lineGap * state.fontSize}
        ref={this.refArray('lines')}
        value={line.value}
        font={state.font}
        fontSize={state.fontSize}
        color={props.color}
      />
    ))

    if (origin.startsWith('S')) {
      // Re-position lines from the bottom of the Paragraph rectangle
      lines.forEach(line => {
        line.props.y += height - (lastOf(lines).props.y - ystart)
      })
    }

    return (
      <g
        class={classnames('paragraph', props.class)}
        store-class-has-overflow={state.hasOverflow}
      >
        {state.rectangle.vnode({ class: 'guide guide--rectangle no-export' })}
        {lines}
      </g>
    )
  }

  afterRender () {
    if (!this.refs.lines) this.state.bbox = BoundingBox.empty(this.state.rectangle.x, this.state.rectangle.y)
    else {
      this.state.bbox = new BoundingBox({
        xmin: this.state.rectangle.x,
        ymin: this.state.rectangle.y,
        xmax: this.state.rectangle.x + this.state.rectangle.width,
        ymax: lastOf(this.refs.lines).props.y
      })
    }

    this.render(Rectangle.fromBBox(this.state.bbox).vnode({ class: 'bounding-box no-export' }), this.base)
  }

  transform ({ translate = [0, 0] } = {}) {
    this.state.bbox.translate(...translate)

    const offx = this.state.bbox.xmin - this.state.rectangle.x
    const offy = this.state.bbox.ymin - this.state.rectangle.y
    this.base.setAttribute('transform', `translate(${offx} ${offy})`)
  }
}
