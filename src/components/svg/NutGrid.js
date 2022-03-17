import { Component } from 'utils/jsx'
import { degrees } from 'missing-math'
import raf from '@internet/raf'
import Matter from 'controllers/Matter'
import pathData from 'utils/path-data'
import randomOf from 'utils/array-random'
import * as Matrice from 'transformation-matrix'

import Nut from 'components/svg/Nut'

export default class NutGrid extends Component {
  beforeRender (props) {
    this.tick = this.tick.bind(this)
    this.update = this.update.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.state = {
      nuts: new Map(),
      usePhysics: props.usePhysics !== false,
      simulation: undefined // SEE afterMount
    }
  }

  template (props) {
    return [
      <g class='nut-grid'>
        {props.debug && <g class='no-export' ref={this.ref('matterDebug')} />}
        <rect class='no-export bounding-box nut-grid__frame' x={props.x || 0} y={props.y || 0} width={props.width} height={props.height} ref={this.ref('frame')} fill='none' />
        <g class='nut-grid__nuts' ref={this.ref('container')} />
      </g>
    ]
  }

  afterRender () {
    window.addEventListener('resize', this.handleResize)
  }

  afterMount (props) {
    this.state.simulation = this.state.usePhysics && Matter(this.refs.frame, {
      render: false,
      debug: props.debug,
      timeScale: 0.1,
      gravity: props.gravity,
      walls: { padding: props.padding, thickness: 1000 },
      mouse: { radius: props.mouseRadius ?? 1 }
    })

    raf.add(this.tick)
    this.update()
  }

  update () {
    const { width, height } = this.props
    const length = this.props.length || 1
    const padding = (this.props.padding || 0)
    const margin = (this.props.margin || padding)

    // Compute max nut size based on length and format dimensions
    const vmax = Math.max(width, height) - (padding * 2)
    const size = (vmax / length) - margin

    // Compute nuts length on x and y directions
    const ratio = width / height
    const xlen = Math.floor(ratio >= 1 ? length : length / ratio)
    const ylen = Math.floor(ratio >= 1 ? length / ratio : length)

    // Compute padding start so that grid is always centered
    const xstart = (width - (size * xlen) - (margin * (xlen - 1))) / 2
    const ystart = (height - (size * ylen) - (margin * (ylen - 1))) / 2

    // Draw from center
    const xoff = xstart + (size / 2)
    const yoff = ystart + (size / 2)

    for (let i = 0; i < xlen; i++) {
      const x = xoff + i * (size + margin)
      for (let j = 0; j < ylen; j++) {
        const y = yoff + j * (size + margin)
        const shape = randomOf(Array.isArray(this.props.shape)
          ? this.props.shape
          : [this.props.shape || 'hex']
        )
        const angle = shape === 'hex' ? Math.random() * Math.PI / 2 : 0

        const nut = this.state.simulation && this.state.simulation.nutBody(
          x + this.props.x,
          y + this.props.y,
          size,
          { shape, angle }
        )
        const body = this.state.simulation && this.state.simulation.add(nut)

        const nutInstance = this.render((
          <Nut
            shape={shape}
            x={x + this.props.x}
            y={y + this.props.y}
            width={size}
            height={size}
            fill={this.props.color}
            opacity={this.props.debug ? 0.5 : 1}
            angle={angle}
            attributes={this.props.attributes || {}}
          />
        ), this.refs.container).components[0]

        this.state.nuts.set(body.id, nutInstance)
      }
    }
  }

  tick () {
    if (!this.state.simulation) return

    this.state.simulation.update()
    if (this.state.simulation.debug) this.refs.matterDebug.innerHTML = ''

    for (const body of this.state.simulation.bodies) {
      if (this.state.simulation.debug) {
        this.render(<path d={pathData(body.vertices.map(({ x, y }) => [x, y]))} fill='none' stroke='black' />, this.refs.matterDebug)
      }

      const ref = this.state.nuts.get(body.id)
      ref && ref.updateMatrice({
        x: body.position.x,
        y: body.position.y,
        angle: body.angle
      })
    }
  }

  handleResize () {
    if (!this.state.simulation) return
    this.state.simulation.resize()
  }

  beforeDestroy () {
    raf.remove(this.tick)
    if (this.state.simulation) this.state.simulation.destroy()
    window.removeEventListener('resize', this.handleResize)
  }
}
