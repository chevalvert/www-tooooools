import { readable } from 'utils/state'
import NutGrid from 'components/svg/NutGrid'
import Paragraph from 'components/svg/Paragraph'
import { map } from 'missing-math'

function posterTemplate ({ width, height, fonts, colors, usePhysics }) {
  const padding = height / 20
  return [
    <Paragraph
      x={padding}
      y={padding}
      font={fonts.friction}
      fontSize={height / 10}
      color={colors.foreground}
    >
      Toools™
    </Paragraph>,
    <NutGrid
      x={0}
      y={height / 2}
      width={width}
      height={height / 2}
      length={20}
      padding={padding}
      color={colors.accent}
      usePhysics={usePhysics}
      mouseRadius={padding}
    />
  ]
}

export default {
  fonts: readable({
    friction: '/assets/fonts/friction-mono.otf',
    styrene: '/assets/fonts/styrenea-regular.otf'
  }),

  // The properties below will be transformed into signals and updated
  // via matching DOM inputs

  color: ['#74ffb0', '#1ea1ed', '#f9eb0b'],
  shape: ['square', 'hex', 'circle'], // TODO
  export: function () { console.log('TODO') },
  usePhysics: false,
  format: [
    { // WIP
      label: 'Post Instagram',
      colorSpace: 'RVB',
      width: 1080,
      height: 1080,
      unit: 'px',
      filename: 'post-instagram.png',
      template: ({ width, height, fonts, colors, usePhysics }) => {
        return [
          <Paragraph
            x={50}
            y={50}
            font={fonts.friction}
            fontSize={150}
            color={colors.foreground}
          >
            Toools™
          </Paragraph>,
          <Paragraph
            x={50}
            y={height - 74}
            origin='SW'
            font={fonts.styrene}
            width={width - 100}
            height={1}
            fontSize={50}
            lineGap={1.2}
            color={colors.foreground}
          >
            Toools™ propose des outils de création et des solutions stratégiques pour la conception, la réalisation et la diffusion d’univers graphiques vivants et génératifs.
          </Paragraph>,
          <NutGrid
            x={50}
            y={300}
            length={10}
            width={width - 100}
            height={300}
            padding={0}
            color={colors.accent}
            usePhysics={usePhysics}
            gravity={{ x: 0, y: 1, scale: 0.1 }}
            mouseRadius={20}
          />
        ]
      }
    },

    { // TODO
      label: 'Poster, impression numérique',
      colorSpace: 'CMJN',
      width: 70,
      height: 100,
      unit: 'cm',
      filename: 'poster.pdf',
      template: posterTemplate
    },

    { // TODO
      label: 'Poster, sérigraphie',
      colorSpace: 'Monochrome',
      width: 70,
      height: 100,
      unit: 'cm',
      filename: 'poster.pdf',
      template: posterTemplate
    },

    { // TODO
      label: 'Tote bag',
      colorSpace: 'Sérigraphie',
      width: 370,
      height: 370,
      unit: 'cm',
      filename: 'tote-bag.pdf',
      template: ({ width, height, fonts, colors, usePhysics }) => {
        // [0, 100] to mockup system coordinates
        const vw = (v, offset = true) => (offset ? 95 : 0) + map(v, 0, 100, 0, 186)
        const vh = (v, offset = true) => (offset ? 120 : 0) + map(v, 0, 100, 0, 205)

        return [
          <image
            href='/assets/test.jpg'
            width={width}
            height={height}
            preserveAspectRatio='xMidYMid slice'
          />,
          <rect class='no-export bounding-box' x={vw(0)} y={vh(0)} width={vw(100, false)} height={vh(100, false)} />,
          <Paragraph
            x={vw(10)}
            y={vh(10)}
            font={fonts.friction}
            fontSize={vh(10, false)}
            color={colors.foreground}
          >
            Toools™
          </Paragraph>,
          <NutGrid
            x={vw(10)}
            y={vh(50)}
            width={vw(80, false)}
            height={vh(40, false)}
            padding={0}
            length={10}
            color={colors.accent}
            usePhysics={usePhysics}
            mouseRadius={vw(1, false)}
          />
        ]
      }
    }
  ]
}
