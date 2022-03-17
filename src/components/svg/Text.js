import { Component } from 'utils/jsx'
import classnames from 'classnames'

import BoundingBox from 'abstractions/BoundingBox'

export default class Text extends Component {
  beforeRender ({
    value = '',
    x = 0,
    y = 0,
    font = null,
    fontSize = 72,
    decimals = 6
  } = {}) {
    if (!font) throw new Error('An opentype.js font object is required as `font` prop')
    const path = font.getPath(value, x, y, fontSize)

    this.state = {
      d: path.toPathData(decimals),
      bbox: path.commands.length
        ? BoundingBox.fromOpentypePath(path)
        : BoundingBox.empty(x, y)
    }
  }

  template (props, state) {
    return [
      state.bbox.vnode({ class: 'bounding-box no-export' }),
      <path d={state.d} class={classnames('text', props.class)} fill={props.color} {...props.attributes || {}} />,
      <line class='guide guide--baseline no-export' x1='0%' y1={props.y} x2='100%' y2={props.y} />
    ]
  }
}
