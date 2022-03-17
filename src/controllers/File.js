/* global Blob, FileReader */
import { render } from 'utils/jsx'
import FileSaver from 'file-saver'
import JSZip from 'jszip'

import Convert from 'utils/convert'

// SEE: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
export function browse (accept) {
  return new Promise(resolve => {
    const input = render((
      <input
        type='file'
        style='display: none'
        accept={accept}
        event-change={function () {
          resolve(this.files[0])
          this.remove()
        }}
      />
    ), document.body)

    input.nodes[0].click()
  })
}

export function load (file, {
  method = 'readAsText'
} = {}) {
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error('File is undefined'))

    const fReader = new FileReader()
    fReader.onload = () => resolve(fReader.result)
    fReader.onerror = reject
    fReader[method](file)
  })
}

export function save (filename, { blob, url, json } = {}) {
  if (json) {
    const string = JSON.stringify(json, null, window.ENV.production ? 0 : 2)
    blob = new Blob([string], { mimetype: 'application/json' })
  }

  return FileSaver.saveAs(blob || url, filename)
}

// SEE https://stuk.github.io/jszip/
export async function zip (files, { type = 'blob' } = {}) {
  const zip = new JSZip()

  for (const { filename, blob, url, json } of files) {
    let data

    if (json) {
      const string = JSON.stringify(json, null, window.ENV.production ? 0 : 2)
      data = new Blob([string], { mimetype: 'application/json' })
    } else if (url) {
      data = await Convert.objectURL(url).toBlob()
    } else {
      data = blob
    }

    zip.file(filename, data)
  }

  return zip.generateAsync({ type })
}

export default {
  isFile: file => file instanceof window.File,
  browse,
  load,
  save,
  zip
}
