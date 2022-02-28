import 'pathseg'
import MatterAttractors from 'matter-attractors'
import decomp from 'poly-decomp'
import clone from 'clone'
import {
  Bodies,
  Body,
  Common,
  Composite,
  Engine,
  Render,
  Runner,
  use
} from 'matter-js'
import randomOf from 'utils/array-random'

use(MatterAttractors)
Common.setDecomp(decomp)

const ATTRACTOR = {
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

const TRAITS = [
  {},
  { initialNuts: ATTRACTOR }
  // { initialNuts: ATTRACTOR, mouse: ATTRACTOR },
  // { initialNuts: ATTRACTOR, mouse: ATTRACTOR, nuts: ATTRACTOR }
]

export default function ({
  padding = 30,
  debug = window.location.hash === '#debug'
} = {}) {
  const element = document.querySelector('.view#home')
  const logoElement = element && element.querySelector('#home h1 svg')
  if (!logoElement) return

  const { width, height } = element.getBoundingClientRect()
  element.classList.toggle('has-wireframe', debug)

  // Instanciate matter-js context
  const trait = randomOf(TRAITS)
  console.log(`Using trait #${TRAITS.indexOf(trait)}:`, trait)

  const engine = Engine.create({ gravity: trait.gravity || { scale: 0 } })
  const render = Render.create({
    engine,
    element,
    options: {
      width,
      height,
      pixelRatio: window.devicePixelRatio || 1,
      background: null,
      wireframeBackground: '#0e1019',
      showVelocity: debug,
      wireframes: debug,
      showDebug: debug,
      showAxes: debug
    }
  })

  const world = engine.world
  const collisions = { none: 0x0000, nuts: 0x0002 }

  // Run the physics engine and renderer
  const runner = Runner.create()
  Render.run(render)

  // Bind events
  window.addEventListener('resize', handleResize)
  element.addEventListener('mousemove', handleMove)
  element.addEventListener('click', handleClick)

  // Add a mouse body
  const mouse = Bodies.circle(width / 2, height / 2, 10, Object.assign({
    render: { visible: debug },
    isStatic: true,
    collisionFilter: { mask: collisions.nuts }
  }, trait.mouse || {}))

  Composite.add(world, mouse)
  Composite.add(world, logoBodies())
  Composite.add(world, wallBodies())

  function getCursorPosition (e, { fixed = false } = {}) {
    const yoff = fixed ? -document.documentElement.scrollTop : 0
    return { x: e.pageX, y: e.pageY + yoff }
  }

  function handleResize () {
    start()

    const { width, height } = element.getBoundingClientRect()
    const prevWidth = render.bounds.max.x
    const prevHeight = render.bounds.max.y

    render.bounds.max.x = width
    render.bounds.max.y = height
    render.options.width = width
    render.options.height = height
    render.canvas.width = width * render.options.pixelRatio
    render.canvas.height = height * render.options.pixelRatio
    render.canvas.style.width = width + 'px'
    render.canvas.style.height = height + 'px'

    // Scale all body positions
    for (const body of world.bodies) {
      Body.setPosition(body, {
        x: body.position.x / (prevWidth / width),
        y: body.position.y / (prevHeight / height)
      })
    }

    // Re-spawn walls to ensure that they match container element dimensions
    Composite.remove(world, world.bodies.filter(body => body && body.label === 'wall'))
    Composite.add(world, wallBodies())

    // Re-spawn logo elements to ensure sizes are synced even with complex CSS styling
    Composite.remove(world, world.bodies.filter(body => body && body.label === 'logo'))
    Composite.add(world, logoBodies({ nut: false }))
  }

  function handleMove (e) {
    const xoff = 2
    const yoff = 5
    const { x, y } = getCursorPosition(e)
    Body.setPosition(mouse, { x: x + xoff, y: y + yoff })
    // TODO: Cancel gravity: https://github.com/liabru/matter-js/issues/765
  }

  function handleClick (e) {
    if (e.target !== render.canvas) return
    start()

    const nuts = world.bodies.filter(body => body.label === 'nut').slice(0, 3)
    const clonedNut = Object.assign(
      clone(randomOf(nuts), true),
      { id: Common.nextId() }
    )

    Body.setPosition(clonedNut, getCursorPosition(e))
    Body.setAngle(clonedNut, Math.random() * Math.PI)
    Composite.add(world, clonedNut)
  }

  // Start engine if not started yet
  function start () {
    if (runner.isRunning) return
    Runner.run(runner, engine)
    runner.isRunning = true
  }

  function logoBodies ({ nut = true } = {}) {
    const bodies = []
    for (const el of logoElement.querySelectorAll('path')) {
      const offy = document.documentElement.scrollTop
      const { left, top, width, height } = el.getBoundingClientRect()
      const isNut = el.classList.contains('nut')

      if (isNut) {
        el.style.visibility = 'hidden'

        // Keep track of initial nuts position
        bodies.push(Bodies.circle(left + width / 2, top + height / 2 + offy, 1, Object.assign({
          label: 'logo',
          isStatic: true,
          render: { visible: debug },
          collisionFilter: { mask: collisions.none }
        }, trait.initialNuts || {})))
      }

      if (!nut && isNut) continue

      const style = window.getComputedStyle(el)
      const body = isNut
        ? nutBody(left + width / 2, top + height / 2 + offy, width, {
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: parseInt(style['stroke-width'])
        })
        : Bodies.rectangle(left + width / 2, top + height / 2 + offy, width, height, {
          label: 'logo',
          isStatic: true,
          render: { visible: debug }
        })
      bodies.push(body)
    }

    return bodies
  }

  function wallBodies ({ thickness = 100 } = {}) {
    const { width, height } = element.getBoundingClientRect()
    return [
      [width / 2, padding - (thickness / 2), width, thickness],
      [width / 2, height + (thickness / 2) - padding, width, thickness],
      [padding - (thickness / 2), height / 2, thickness, height],
      [width + (thickness / 2) - padding, height / 2, thickness, height]
    ].map(([x, y, w, h]) => Bodies.rectangle(x, y, w, h, {
      label: 'wall',
      isStatic: true,
      render: { visible: debug }
    }))
  }

  function nutBody (x = width / 2, y = height / 2, diameter = randomOf([60, 60, 60, 160]), {
    fill = 'black',
    stroke = 'none',
    strokeWidth = 2
  }) {
    return Bodies.polygon(x, y, 6, diameter / 2, Object.assign({
      label: 'nut',
      // angle: Math.random() * Math.PI,
      collisionFilter: {
        category: collisions.nuts
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
    }, trait.nuts || {}))
  }
}
