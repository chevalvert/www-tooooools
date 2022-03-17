import { Component } from 'utils/jsx'
import { degrees } from 'missing-math'
import * as Matrice from 'transformation-matrix'

const BBOX_FIX = 'M0,0 M100,100 '

export default class Nut extends Component {
  // All paths are drawn on the center of a 100*100 viewBox
  static get PATHS () {
    const square = BBOX_FIX + 'M19.106,50C19.106,32.937 32.937,19.106 50,19.106C67.063,19.106 80.894,32.939 80.894,50.002C80.894,67.065 67.063,80.894 50,80.894C32.937,80.894 19.106,67.063 19.106,50M100,100.002L100,0.002L0,0L0,100L100,100.002Z'
    const hex = BBOX_FIX + 'M22.011,50C22.011,34.542 34.543,22.012 50.001,22.012C65.459,22.012 77.989,34.542 77.989,50C77.989,65.458 65.459,77.99 50.001,77.99C34.543,77.99 22.011,65.458 22.011,50M93.3,74.999L93.3,24.999L50.001,0L6.7,24.999L6.7,74.999L50.001,100L93.3,74.999Z'
    const circle = BBOX_FIX + 'M79.018,50C79.018,66.027 66.027,79.018 50,79.018C33.973,79.018 20.982,66.027 20.982,50C20.982,33.973 33.973,20.982 50,20.982C66.027,20.982 79.018,33.973 79.018,50M0,50C0,77.614 22.386,100 50,100C77.614,100 100,77.614 100,50C100,22.386 77.614,0 50,0C22.386,0 0,22.386 0,50'
    return { square, hex, circle, 4: square, 6: hex, 0: circle }
  }

  beforeRender (props) {
    this.state = {
      shape: props.shape || 'hex'
    }
  }

  template (props) {
    return (
      <path
        {...Object.assign({}, props, { shape: null })}
        {...props.attributes || {}}
        d={Nut.PATHS[props.shape]}
      />
    )
  }

  afterMount (props) {
    this.updateMatrice()
  }

  updateMatrice ({
    x = this.props.x || 0,
    y = this.props.y || 0,
    width = this.props.width || 100,
    height = this.props.height || 100,
    angle = this.props.angle || 0
  } = {}) {
    const scaleX = width / 100
    const scaleY = height / 100

    const transformations = Matrice.compose(
      Matrice.translate(x, y),
      Matrice.rotate(angle || 0, [x + width / 2, y + height / 2]),
      Matrice.translate(-width / 2, -height / 2),
      Matrice.scale(scaleX, scaleY)
    )

    // To ensure maximum compatibility with arnaudjuracek/svg-to-pdf, we
    // re-decompose the composed matrice so that any Matrice transformations
    // will always be computed with only three operations. This avoid using the
    // raw matrice string, which sometimes caused problems
    const { translate, scale, rotation } = Matrice.decomposeTSR(transformations)
    this.base.setAttribute('transform', `translate(${translate.tx} ${translate.ty}) scale(${scale.sx} ${scale.sy}) rotate(${degrees(rotation.angle)})`)

    // Ensure maximum compatibility with arnaudjuracek/svg-to-pdf
    this.base.setAttribute('x', 0)
    this.base.setAttribute('y', 0)
  }
}
