import parse from 'parse-svg-path'
import abs from 'abs-svg-path'
import normalize from 'normalize-svg-path'
import serialize from 'serialize-svg-path'
import bbox from 'svg-path-bbox'

export default d => {
  const path = normalize(abs(parse(d)))

  console.log(path)

  path.boundingBox = bbox(d)
  path.toString = () => serialize(path)

  return path
}
