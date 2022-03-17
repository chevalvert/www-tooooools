import { Component } from 'utils/jsx'
import { derived } from 'utils/state'

export default class PaperInfo extends Component {
  beforeRender (props) {
    this.handleExport = this.handleExport.bind(this)

    const format = props['store-format']
    this.state = {
      label: derived(format, format => format.label),
      dimensions: derived(format, format => {
        return `${format.colorSpace[document.documentElement.lang]}, ${format.dimensions[0]}&times;${format.dimensions[1]}&thinsp;${format.dimensions[2]}`
      }),
      file: derived(format, format => `${format.filename}.${format.extension}`)
    }
  }

  template (props, state) {
    return (
      <div class='paper-info'>
        <div class='paper-info__label' store-innerHTML={state.label} />
        <div class='paper-info__dimensions' store-innerHTML={state.dimensions} />
        <div
          ref={this.ref('file')}
          class='paper-info__file'
          event-click={this.handleExport}
          store-innerHTML={state.file}
        />
      </div>
    )
  }

  async handleExport () {
    this.refs.file.classList.add('is-loading')
    this.props['event-export']()
    this.refs.file.classList.remove('is-loading')
  }
}
