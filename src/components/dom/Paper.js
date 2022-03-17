import { Component } from 'utils/jsx'
import { derived, readable, writable } from 'utils/state'
import Export from 'controllers/PlaygroundExport'
import Color from 'abstractions/Color'

import PaperInfo from 'components/dom/PaperInfo'

export default class Paper extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFormat = this.handleFormat.bind(this)
    this.handleExport = this.handleExport.bind(this)

    const background = derived([props.format, props.color], () => props.format.current.colorSpace.override || props.color.current)
    this.state = {
      debug: writable(false),
      background,
      foreground: derived(background, bg => bg.contrast),
      // NOTE: the accent may be defined in the Store.colors in a later stage
      accent: readable(Color.white)
    }
  }

  template (props, state) {
    const [width, height, unit] = props.format.current.dimensions

    return (
      <div
        class='paper'
        store-class-debug={this.state.debug}
      >
        <svg
          ref={this.ref('svg')}
          viewBox={`0 0 ${width} ${height}`}
          width={width + unit}
          height={height + unit}
          event-click={this.handleClick}
        >
          <g class='paper__layout' ref={this.ref('layout')} />
        </svg>
        <PaperInfo store-format={this.props.format} event-export={this.handleExport} />
      </div>
    )
  }

  afterRender (props) {
    props.format.subscribe(this.handleFormat)
    props.color.subscribe(this.update)
    props.shape.subscribe(this.update)
    props.usePhysics.subscribe(this.update)

    this.update()
  }

  clear () {
    this.refs.layout.innerHTML = ''

    for (let i = this._collector.components.length - 1; i >= 0; i--) {
      const component = this._collector.components[i]
      if (component instanceof PaperInfo) continue
      component.destroy()
    }
  }

  update () {
    const { dimensions, colorSpace, template } = this.props.format.get()
    const background = this.state.background.get()

    this.clear()

    // Render background color
    this.render((
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        class='paper__background'
        {...background.apply({ attribute: 'fill', colorSpace: colorSpace.value })}
      />
    ), this.refs.layout)

    // Render paper layout, SEE controllers/PlaygroundFormats
    if (!template) return
    const vnodes = template({
      width: dimensions[0],
      height: dimensions[1],
      fonts: this.props.fonts.get(),
      usePhysics: this.props.usePhysics.get(),
      colorSpace: colorSpace.value,
      shape: this.props.shape.get(),
      colors: {
        background,
        foreground: this.state.foreground.get(),
        accent: this.state.accent.get()
      }
    })
    for (const vnode of vnodes) this.render(vnode, this.refs.layout)
  }

  handleClick () {
    this.state.debug.set(!this.state.debug.current)
  }

  handleFormat ({ dimensions }) {
    const [width, height, unit] = dimensions
    this.refs.svg.setAttribute('width', width + unit)
    this.refs.svg.setAttribute('height', height + unit)
    this.refs.svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    this.update()
  }

  async handleExport () {
    await Export(this)
  }

  beforeDestroy () {
    this.props.color.unsubscribe(this.update)
    this.props.format.unsubscribe(this.handleFormat)
    this.shape.format.unsubscribe(this.handleFormat)
    this.props.usePhysics.unsubscribe(this.update)
  }

  async toSVGString (callbacks = []) {
    // Working on a cloned node so that we can stay idempotent
    const svg = this.refs.svg.cloneNode(true)

    // Remove unwanted elements
    svg.querySelectorAll('.no-export').forEach(el => el.remove())
    svg.querySelectorAll('g:empty').forEach(el => el.remove())

    // Run optional callbacks against the cloned SVG
    for (const callback of callbacks.filter(Boolean)) await callback(svg)

    return svg.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
}
