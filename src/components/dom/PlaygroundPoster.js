import { Component } from 'utils/jsx'
import { derived, readable, writable } from 'utils/state'

export default class PlaygroundPoster extends Component {
  beforeRender (props) {
    this.update = this.update.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFormat = this.handleFormat.bind(this)

    this.state = {
      debug: writable(false),
      // TODO: handle CMYK colorSpace
      background: derived([props.format, props.color], () => props.format.current.colorSpace === 'Monochrome' ? 'black' : props.color.current),
      foreground: derived(props.format, () => props.format.current.colorSpace === 'Monochrome' ? 'white' : 'black'),
      accent: readable('white')
    }
  }

  template (props, state) {
    const { width, height, unit } = props.format.get()

    return (
      <div
        class='playground-poster'
        store-class-debug={this.state.debug}
      >
        <svg
          ref={this.ref('svg')}
          viewBox={`0 0 ${width} ${height}`}
          width={width + unit}
          height={height + unit}
          event-click={this.handleClick}
        >
          <rect x='0' y='0' width='100%' height='100%' store-fill={state.background} />
          <g class='playground-poster__layout' ref={this.ref('layout')} />
        </svg>
        <div class='playground-poster__format' ref={this.ref('format')} />
      </div>
    )
  }

  afterRender (props) {
    props.format.subscribe(this.handleFormat)
    props.usePhysics.subscribe(this.update)

    this.update()
  }

  clear () {
    this.refs.layout.innerHTML = ''
    this.refs.format.innerHTML = ''
    this._collector.components.forEach(component => component.destroy())
  }

  update () {
    const {
      label,
      width,
      height,
      unit,
      filename,
      colorSpace,
      template
    } = this.props.format.get()

    this.clear()

    this.render(<div class='format-label'>{label}</div>, this.refs.format)
    this.render(<div class='format-dimensions'>{colorSpace}, {width}&times;{height}&thinsp;{unit}</div>, this.refs.format)
    this.render(<div class='format-file'>{filename}</div>, this.refs.format)

    // SEE controllers/PlaygroundFormats
    if (!template) return
    const vnodes = template({
      width,
      height,
      fonts: this.props.fonts.get(),
      usePhysics: this.props.usePhysics.get(),
      colors: {
        background: this.state.background.get(),
        foreground: this.state.foreground.get(),
        accent: this.state.accent.get()
      }
    })
    this.render(vnodes, this.refs.layout)
  }

  handleClick () {
    this.state.debug.set(!this.state.debug.current)
  }

  handleFormat ({ width, height, unit, colorSpace }) {
    this.refs.svg.setAttribute('width', width + unit)
    this.refs.svg.setAttribute('height', height + unit)
    this.refs.svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    this.update()
  }

  beforeDestroy () {
    this.props.format.unsubscribe(this.handleFormat)
    this.props.usePhysics.unsubscribe(this.update)
  }
}
