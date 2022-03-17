import { readable } from 'utils/state'
import Color from 'abstractions/Color'

import Export from 'controllers/PlaygroundExport'
import * as Layouts from 'controllers/PlaygroundLayouts'

const ColorSpaces = {
  monochromatic: { value: 'RGB', fr: 'Monochrome', en: 'Monochrome', override: Color.black },
  RGB: { value: 'RGB', fr: 'RVB', en: 'RGB' },
  CMYK: { value: 'CMYK', fr: 'CMJN', en: 'CMYK' }
}

export default {
  fonts: readable({
    friction: '/assets/fonts/friction-mono.otf',
    styrene: '/assets/fonts/styrenea-regular.otf'
  }),

  export: Export,

  // The properties below will be transformed into signals and updated
  // via matching DOM inputs, SEE view/playground.js

  color: [
    new Color('#F9EB0B', { CMYK: [0, 6, 96, 2], proof: [255, 221, 65], contrast: Color.black }),
    new Color('#1EA1ED', { CMYK: [87, 32, 0, 7], proof: [17, 138, 199], contrast: Color.white }),
    new Color('#74FFB0', { CMYK: [55, 0, 31, 0], proof: [104, 208, 193], contrast: Color.white })
  ],
  shape: [
    'hex',
    'square',
    'circle',
    ['square', 'hex', 'hex', 'hex', 'circle', 'circle']
  ],
  usePhysics: false,
  format: [
    {
      label: 'Post Instagram',
      template: Layouts.instagram,
      colorSpace: ColorSpaces.RGB,
      dimensions: [1080, 1080, 'px'],
      filename: 'post-instagram',
      extension: 'png'
    },

    {
      label: 'Poster, impression numérique',
      template: Layouts.poster,
      colorSpace: ColorSpaces.CMYK,
      dimensions: [70, 100, 'cm'],
      filename: 'poster',
      extension: 'pdf'
    },

    {
      label: 'Poster, sérigraphie',
      template: Layouts.poster,
      colorSpace: ColorSpaces.monochromatic,
      dimensions: [70, 100, 'cm'],
      filename: 'poster-typon',
      extension: 'svg'
    },

    {
      label: 'Tote bag',
      template: Layouts.toteBag,
      colorSpace: ColorSpaces.monochromatic,
      dimensions: [370, 370, 'cm'],
      filename: 'tote-bag',
      extension: 'pdf'
    }
  ]
}
