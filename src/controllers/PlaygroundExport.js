/* global Blob, OffscreenCanvas, Image */
import Color from 'abstractions/Color'
import File from 'controllers/File'
import APIServer from 'controllers/APIServer'

// Good enough polyfill
window.requestIdleCallback = window.requestIdleCallback || window.requestAnimationFrame

function resolveCMYKColors (svg) {
  for (const element of svg.querySelectorAll('[fill], [stroke]')) {
    Color.resolveCMYKAttributes(element)
  }
}

const Transform = {
  png: (paper, { upsample = 1 } = {}) => new Promise(resolve => {
    window.requestIdleCallback(async () => {
      const svgString = await paper.toSVGString()
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })

      const image = new Image()
      image.onload = async function () {
        const canvas = window.OffscreenCanvas
          ? new OffscreenCanvas(this.width / upsample, this.height / upsample)
          : document.createElement('canvas')

        if (!window.OffscreenCanvas) {
          canvas.width = this.width / upsample
          canvas.height = this.height / upsample
        }

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        URL.revokeObjectURL(this.src)
        if (window.OffscreenCanvas) resolve({ blob: await canvas.convertToBlob({ type: 'image/png', quality: 1 }) })
        else canvas.toBlob(blob => resolve({ blob }), 'image/png', 1)
      }

      image.src = URL.createObjectURL(svgBlob)
    })
  }),

  svg: async (paper, { colorSpace } = {}) => {
    const svgString = await paper.toSVGString([colorSpace === 'CMYK' && resolveCMYKColors])
    return {
      blob: new Blob([svgString], { type: 'image/svg+xml' })
    }
  },

  pdf: async (paper, { colorSpace, unit } = {}) => {
    const files = {}
    const isCMYK = colorSpace === 'CMYK'

    const svgString = await paper.toSVGString([colorSpace === 'CMYK' && resolveCMYKColors])
    const { location } = await APIServer.pdf({
      svgString,
      files,
      pdfOptions: {
        colorSpace: colorSpace.toLowerCase(),
        title: 'Toools™',
        subject: 'Toools™',
        author: 'Toools™',
        userUnit: unit,
        createFilesReport: false,
        bleed: isCMYK ? 50 : 0,
        marks: {
          colors: isCMYK,
          crop: isCMYK,
          registration: isCMYK
        }
      }
    })

    return { url: location }
  }
}

export default async function (paper) {
  const { extension, filename, colorSpace, unit } = paper.props.format.get()
  File.save(
    filename + '.' + extension,
    await Transform[extension](paper, {
      colorSpace: colorSpace.value,
      unit
    })
  )
}
