import { writable } from 'utils/state'
import { Component } from 'utils/jsx'

import SvgPath from 'abstractions/SvgPath'
import { roundTo, normalize, map } from 'missing-math'
import { distanceSq } from 'utils/distance'

// TODO: handle keyboard step down / step up when element has focus
export default class Slider extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.handleBeginDrag = this.handleBeginDrag.bind(this)
    this.handleEndDrag = this.handleEndDrag.bind(this)
    this.handleDrag = this.handleDrag.bind(this)

    const path = new SvgPath(props.path || 'M 0 0 L 1 1')

    this.state = {
      value: props['store-value'] || writable(props.value || 0),
      step: parseFloat(props.step || 1),
      min: parseFloat(props.min || 0),
      max: parseFloat(props.max || 1),
      path,

      isActive: writable(false),

      boundingClientRect: writable(undefined),
      viewBox: [
        path.boundingBox[0],
        path.boundingBox[1],
        (path.boundingBox[2] - path.boundingBox[0]) || 1,
        (path.boundingBox[3] - path.boundingBox[1]) || 1
      ]
    }

    this.log(this.state)
  }

  template (props, state) {
    const d = state.path.toString()

    return (
      <div
        class='slider'
        store-class-is-active={state.isActive}
        // Make the element focusable by giving it a tabIndex of 0, which inserts
        // it in the natural tab order of the document
        tabIndex='0'
      >
        <div
          class='slider__thumb'
          ref={this.ref('thumb')}
          event-mousedown={this.handleBeginDrag}
        />
        <svg viewBox={state.viewBox.join(' ')} ref={this.ref('svg')}>
          <path class='slider__track-hitbox' d={d} event-mousedown={this.handleBeginDrag} />
          <path class='slider__track-ticks' d={d} />
          <path class='slider__track' d={d} />
        </svg>
      </div>
    )
  }

  afterMount () {
    // Memoize data based on boundingClientRect
    const bbox = this.base.getBoundingClientRect()
    this.state.boundingClientRect.set(bbox)

    const toScreen = ([nx, ny]) => ([
      map(nx, 0, 1, bbox.left, bbox.width + bbox.left),
      map(ny, 0, 1, bbox.top, bbox.height + bbox.top)
    ])

    this.pathSamples = []
    // WARNING: possible bottleneck if step is very small or range is very big
    const SAMPLES_LENGTH = (this.state.max - this.state.min) / this.state.step
    console.log(SAMPLES_LENGTH)
    for (let i = 0; i < SAMPLES_LENGTH; i++) {
      const t = i / SAMPLES_LENGTH
      this.pathSamples.push({
        t,
        p: toScreen(this.state.path.getPosition(t, { normalize: true }))
      })
    }

    const scale = bbox.width / (this.state.viewBox[2] - this.state.viewBox[0])
    this.refs.svg.style.setProperty(
      '--ticks-space',
      ((this.state.path.totalLength / SAMPLES_LENGTH) * scale) + 'px'
    )

    this.state.value.subscribe(this.update)
    this.update()
  }

  setValueFromLength (t) {
    const v = map(t, 0, 1, this.state.min, this.state.max)
    this.state.value.set(roundTo(v, this.state.step))
  }

  update () {
    const t = normalize(this.state.value.get(), this.state.min, this.state.max)
    const [nx, ny] = this.state.path.getPosition(t, true)
    this.refs.thumb.style.setProperty('--x', (nx * 100) + '%')
    this.refs.thumb.style.setProperty('--y', (ny * 100) + '%')
  }

  handleBeginDrag (e) {
    document.addEventListener('mousemove', this.handleDrag)
    document.addEventListener('mouseup', this.handleEndDrag)
    document.addEventListener('mouseleave', this.handleEndDrag)
    this.state.isActive.set(true)
    this.setValueFromLength(this.getClosestLength(e))
  }

  handleDrag (e) {
    if (!this.state.isActive.get()) return
    window.requestAnimationFrame(() => {
      this.setValueFromLength(this.getClosestLength(e))
    })
  }

  handleEndDrag (e) {
    this.state.isActive.set(false)
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleEndDrag)
  }

  getClosestLength (e) {
    return this.pathSamples.sort((a, b) => {
      const cursor = [e.pageX, e.pageY]
      return distanceSq(a.p, cursor) - distanceSq(b.p, cursor)
    })[0].t
  }

  beforeDestroy () {
    this.state.value.unsubscribe(this.update)
  }
}
