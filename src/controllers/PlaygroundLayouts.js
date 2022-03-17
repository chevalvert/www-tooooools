import NutGrid from 'components/svg/NutGrid'
import Paragraph from 'components/svg/Paragraph'
import { map } from 'missing-math'

const colorPropsHelper = (colors, colorSpace) => (key, attribute = 'fill') => (
  colors[key]
    ? colors[key].apply({ attribute, colorSpace })
    : {}
)

// WIP
export const instagram = ({ width, height, fonts, colors, usePhysics, colorSpace, shape }) => {
  const color = colorPropsHelper(colors, colorSpace)
  return [
    <Paragraph
      x={50}
      y={50}
      font={fonts.friction}
      fontSize={150}
      attributes={color('foreground')}
    >
      Toools™
    </Paragraph>,
    <Paragraph
      attributes={color('foreground')}
      x={50}
      y={height - 74}
      origin='SW'
      font={fonts.styrene}
      width={width - 100}
      height={1}
      fontSize={50}
      lineGap={1.2}
    >
      Toools™ propose des outils de création et des solutions stratégiques pour la conception, la réalisation et la diffusion d’univers graphiques vivants et génératifs.
    </Paragraph>,
    <NutGrid
      attributes={color('accent')}
      x={50}
      y={300}
      length={7}
      width={width - 100}
      height={300}
      padding={0}
      usePhysics={usePhysics}
      shape={shape}
      gravity={{ x: 0, y: 1, scale: 0.1 }}
      mouseRadius={20}
      debug
    />
  ]
}

// WIP
export const poster = ({ width, height, fonts, colors, usePhysics, colorSpace, shape }) => {
  const padding = height / 100
  const color = colorPropsHelper(colors, colorSpace)

  return [
    <Paragraph
      x={padding}
      y={padding}
      font={fonts.friction}
      fontSize={height / 10}
      attributes={color('foreground')}
    >
      Toools™
    </Paragraph>,
    <NutGrid
      x={0}
      y={height / 2}
      width={width}
      height={height / 2}
      length={10}
      margin={padding}
      padding={padding}
      usePhysics={usePhysics}
      mouseRadius={padding}
      shape={shape}
      attributes={color('accent')}
    />
  ]
}

// WIP
export const toteBag = ({ width, height, fonts, colors, usePhysics, colorSpace, shape }) => {
  const color = colorPropsHelper(colors, colorSpace)

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
      attributes={color('foreground')}
      x={vw(10)}
      y={vh(10)}
      font={fonts.friction}
      fontSize={vh(10, false)}
    >
      Toools™
    </Paragraph>,
    <NutGrid
      attributes={color('accent')}
      x={vw(10)}
      y={vh(50)}
      width={vw(80, false)}
      height={vh(40, false)}
      padding={0}
      length={10}
      usePhysics={usePhysics}
      shape={shape}
      mouseRadius={vw(1, false)}
    />
  ]
}
