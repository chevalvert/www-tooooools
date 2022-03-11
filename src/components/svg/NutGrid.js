import { Component } from 'utils/jsx'
import { degrees } from 'missing-math'
import raf from '@internet/raf'
import Matter from 'controllers/Matter'
import pathData from 'utils/path-data'

import Nut from 'components/svg/Nut'

export default class NutGrid extends Component {
  beforeRender (props) {
    this.tick = this.tick.bind(this)
    this.update = this.update.bind(this)
    this.handleResize = this.handleResize.bind(this)

    this.state = {
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

  clear () {
    if (this.state.simulation) this.state.simulation.clear()
  }

  update () {
    const { width, height } = this.props
    const margin = width / 100
    const size = ((Math.max(width, height) - margin) / this.props.length) - margin
    const [sides, shape] = [6, 'hex'] // TODO: allow dynamic shapes

    // TODO: better center method

    for (let x = this.props.padding + (size / 2); x < width - (size / 2) - (this.props.padding); x += size + margin) {
      for (let y = this.props.padding + (size / 2); y < height - (size / 2) - (this.props.padding); y += size + margin) {
        const nut = this.state.simulation && this.state.simulation.nutBody(x + this.props.x, y + this.props.y, size + margin, { sides })
        const body = this.state.simulation && this.state.simulation.add(nut)
        this.render((
          <Nut
            shape={shape}
            x={x + this.props.x - size / 2}
            y={y + this.props.y - size / 2}
            id={body && 'nut_' + body.id}
            width={size}
            height={size}
            fill={this.props.color}
            opacity={this.props.debug ? 0.1 : 1}
            ref={this.refArray('nuts')}
          />
        ), this.refs.container)
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

      // Update found refs
      const ref = this.base.querySelector(`#nut_${body.id}`)
      if (!ref) continue
      const x = body.position.x
      const y = body.position.y
      const alpha = degrees(body.angle - Math.PI / 2)
      ref.width = ref.width || (+ref.getAttribute('width'))
      ref.height = ref.height || (+ref.getAttribute('height'))
      const scaleX = ref.width / 100
      const scaleY = ref.height / 100
      ref.setAttribute('transform', `translate(${x} ${y}) rotate(${alpha}) translate(${-ref.width / 2} ${-ref.height / 2}) scale(${scaleX} ${scaleY})`)
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
