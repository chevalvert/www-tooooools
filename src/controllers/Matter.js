import 'pathseg'
import MatterAttractors from 'matter-attractors'
import decomp from 'poly-decomp'
import clone from 'clone'
import { map } from 'missing-math'
import { Bodies, Body, Common, Composite, Engine, Render, use } from 'matter-js'
import randomOf from 'utils/array-random'

use(MatterAttractors)
Common.setDecomp(decomp)

const COLLISIONS = {
  none: 0x0000,
  nuts: 0x0002
}

export const Attractor = {
  plugin: {
    attractors: [
      function (bodyA, bodyB) {
        return {
          x: (bodyA.position.x - bodyB.position.x) * 1e-5,
          y: (bodyA.position.y - bodyB.position.y) * 1e-5
        }
      }
    ]
  }
}

export default (element, {
  // Renderer options
  render = true,
  debug = false,

  // Scene options
  walls = { padding: 30, thickness: 100 },
  timeScale = 1,

  // Physics options
  gravity = { x: 0, y: 0, scale: 0 },
  mouse = undefined,
  nuts = undefined,
  anchors = undefined
} = {}) => {
  const IS_SVG = element instanceof window.SVGElement

  element.classList.add('has-matter')
  element.classList.toggle('has-wireframe', debug)

  const { width, height } = IS_SVG
    ? element.getBBox()
    : element.getBoundingClientRect()

  const engine = Engine.create({ gravity, timing: { timeScale } })
  const state = { width, height, render: null }

  window.addEventListener('resize', handleResize)

  // Spawn a canvas renderer
  if ((render || debug) && !IS_SVG) {
    state.render = Render.create({
      engine,
      element,
      options: {
        width,
        height,
        pixelRatio: 2, // window.devicePixelRatio || 1,
        background: null,
        wireframeBackground: '#0e1019',
        showVelocity: debug,
        wireframes: debug,
        showDebug: debug,
        showAxes: debug
      }
    })
    Render.run(state.render)
  }

  // Spawn a mouse body
  if (mouse) {
    const mouseBody = Bodies.circle(-100, -100, (mouse.radius || 5) * 2, Object.assign({
      label: 'mouse',
      isStatic: true,
      render: { visible: debug },
      collisionFilter: { mask: COLLISIONS.nuts }
    }, mouse))

    state.handleMouseMove = function (e) {
      const [xoff, yoff] = [2, 5]
      const position = { x: e.pageX + xoff, y: e.pageY + yoff }

      if (IS_SVG) {
        const bbox = element.getBBox()
        const rect = element.getBoundingClientRect()
        position.x = map(e.clientX, rect.x, rect.x + rect.width, bbox.x, bbox.x + bbox.width)
        position.y = map(e.clientY, rect.y, rect.y + rect.height, bbox.y, bbox.y + bbox.height)
      }

      Body.setPosition(mouseBody, position)
    }

    Composite.add(engine.world, mouseBody)
    element.addEventListener('mousemove', state.handleMouseMove)
  }

  // Enclose world inside walls
  if (walls) {
    Composite.add(engine.world, wallBodies())
  }

  const api = {
    nutBody,
    get debug () { return debug },
    get bodies () { return engine.world.bodies },
    get randomNut () {
      const nuts = engine.world.bodies.filter(body => body.label === 'nut').slice(0, 3)
      const clonedNut = Object.assign(
        clone(randomOf(nuts), true),
        { id: Common.nextId() }
      )

      Body.setAngle(clonedNut, Math.random() * Math.PI)
      return clonedNut
    },

    update: dt => Engine.update(engine, dt),
    resize: handleResize,
    clear: ({
      keepWalls = true,
      keepAnchors = true,
      keepMouse = true
    } = {}) => {
      for (let index = engine.world.bodies.length - 1; index >= 0; index--) {
        const body = engine.world.bodies[index]
        if (body.label === 'wall' && keepWalls) continue
        if (body.label === 'anchor' && keepAnchors) continue
        if (body.label === 'mouse' && keepMouse) continue
        Composite.remove(engine.world, body)
      }
    },

    // Add a Matter body to the simulation
    add: (body, position) => {
      if (position) Body.setPosition(body, { x: position[0], y: position[1] })
      Composite.add(engine.world, body)
      return body
    },

    // Append a DOMElement to the simulation
    append: (element, {
      isNut = false,
      keepAnchor = true,
      isStatic = true,
      keepRef = true,
      style = null
    } = {}) => {
      const { left, top, width, height } = element.getBoundingClientRect()
      const [x, y] = [
        left + width / 2,
        top + height / 2 + document.documentElement.scrollTop
      ]

      const body = isNut
        ? nutBody(x, y, width, style)
        : Bodies.rectangle(x, y, width, height, {
          isStatic,
          label: 'DOMElement',
          render: { visible: debug }
        })

      // Keep a reference of static elements, to update positions on resize
      if (isStatic) body.ref = element

      // Keep track of initial element position
      if (keepAnchor) {
        Composite.add(engine.world, Bodies.circle(x, y, 1, Object.assign({
          label: 'anchor',
          isStatic: true,
          render: { visible: debug },
          collisionFilter: { mask: COLLISIONS.none }
        }, anchors || {})))
      }

      Composite.add(engine.world, body)
      return body
    },

    destroy: () => {
      if (state.handleMouseMove) element.removeEventListener('mousemove', state.handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }

  return api

  function handleResize () {
    const { width, height } = IS_SVG
      ? element.getBBox()
      : element.getBoundingClientRect()
    const prevWidth = state.width
    const prevHeight = state.height

    // Update render size
    if (render) {
      state.render.bounds.max.x = width
      state.render.bounds.max.y = height
      state.render.options.width = width
      state.render.options.height = height
      state.render.canvas.width = width * state.render.options.pixelRatio
      state.render.canvas.height = height * state.render.options.pixelRatio
      state.render.canvas.style.width = width + 'px'
      state.render.canvas.style.height = height + 'px'
    }

    // Scale all nuts positions
    for (const body of engine.world.bodies.filter(body => body && body.label === 'nut')) {
      Body.setPosition(body, {
        x: body.position.x / (prevWidth / width),
        y: body.position.y / (prevHeight / height)
      })
    }

    // Re-spawn all static DOM based bodies
    for (const body of engine.world.bodies.filter(body => body && body.isStatic && body.label === 'DOMElement')) {
      Composite.remove(engine.world, body)
      api.append(body.ref, { isStatic: true })
    }

    // Re-spawn walls to ensure that they match container element dimensions
    if (walls) {
      Composite.remove(engine.world, engine.world.bodies.filter(body => body && body.label === 'wall'))
      Composite.add(engine.world, wallBodies())
    }

    // Keep track of new dimensions
    state.width = width
    state.height = height
  }

  function wallBodies () {
    const padding = walls.padding ?? 30
    const thickness = walls.thickness ?? 100

    const { x, y, width, height } = IS_SVG
      ? element.getBBox()
      : element.getBoundingClientRect()

    return [
      [x + width / 2, y + padding - (thickness / 2), width + thickness, thickness],
      [x + width / 2, y + height + (thickness / 2) - padding, width + thickness, thickness],
      [x + padding - (thickness / 2), y + height / 2, thickness, height + thickness],
      [x + width + (thickness / 2) - padding, y + height / 2, thickness, height + thickness]
    ].map(([x, y, w, h]) => Bodies.rectangle(x, y, w, h, {
      label: 'wall',
      isStatic: true,
      render: { visible: debug },
      ...walls
    }))
  }

  function nutBody (x = width / 2, y = height / 2, diameter = 60, {
    sides = 6,
    angle = Math.PI / 2,
    fill = 'black',
    stroke = 'none',
    strokeWidth = 0
  } = {}) {
    let radius = diameter / 2
    if (sides === 4) radius /= Math.cos(Math.PI / sides)

    return Bodies.polygon(x, y, sides, radius, Object.assign({
      label: 'nut',
      angle,
      collisionFilter: {
        category: COLLISIONS.nuts
      },
      render: {
        fillStyle: 'none',
        sprite: {
          texture: `data:image/svg+xml,%3Csvg
            xmlns='http://www.w3.org/2000/svg'
            width='${diameter}'
            height='${diameter}'
            viewBox='-2 -2 104 104'%3E
              %3Cpath d='M22.011,50C22.011,34.542 34.543,22.012 50.001,22.012C65.459,22.012 77.989,34.542 77.989,50C77.989,65.458 65.459,77.99 50.001,77.99C34.543,77.99 22.011,65.458 22.011,50M93.3,74.999L93.3,24.999L50.001,0L6.7,24.999L6.7,74.999L50.001,100L93.3,74.999Z'
              vector-effect='non-scaling-stroke'
              stroke-width='${strokeWidth}'
              stroke='${stroke.replace('#', '%23')}'
              fill='${fill.replace('#', '%23')}'
            /%3E
          %3C/svg%3E%0A`
        }
      }
    }, nuts || {}))
  }
}
