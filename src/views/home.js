import 'pathseg'
import decomp from 'poly-decomp'
// import MatterAttractors'matter-attractors'
import clone from 'clone'
import {
  Bodies,
  Body,
  Common,
  Composite,
  Engine,
  Render,
  Runner
} from 'matter-js'
import randomOf from 'utils/array-random'

// use('matter-attractors')
Common.setDecomp(decomp)

export default function () {
  const debug = false
  const element = document.querySelector('.view#home')
  const logoElement = element && element.querySelector('#home h1 svg')
  if (!logoElement) return

  // Instanciate matter-js context
  const world = Composite.create()
  const engine = Engine.create({
    world,
    gravity: { x: 0, y: 0 }
  })
  const render = Render.create({
    engine,
    element,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      background: null,
      wireframeBackground: null,
      showVelocity: debug,
      wireframes: debug,
      showDebug: debug,
      showAxes: debug
    }
  })

  const collisions = { nuts: 0x0002 }
  const width = render.bounds.max.x
  const height = render.bounds.max.y

  window.addEventListener('resize', handleResize)
  element.addEventListener('mousemove', handleMove)
  element.addEventListener('click', handleClick)

  // Build world boies based on SVG logo
  Composite.add(world, logoBodies())

  // Add walls to the scene
  Composite.add(world, [
    Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true, render: { visible: false } })
  ])

  // Add a mouse body
  const mouse = Bodies.circle(100, 100, 10, {
    render: { visible: debug },
    isStatic: true,
    collisionFilter: { mask: collisions.nuts }
  })
  Composite.add(world, mouse)

  // Run the physics engine and renderer
  Render.run(render)
  const runner = Runner.create()
  Runner.run(runner, engine)

  // TODO: handle touch devices
  function getCursorPosition (e) {
    return { x: e.pageX, y: e.pageY - document.documentElement.scrollTop }
  }

  function handleResize () {
    const targetWidth = window.innerWidth
    const targetHeight = window.innerHeight
    const prevWidth = render.bounds.max.x
    const prevHeight = render.bounds.max.y

    render.bounds.max.x = targetWidth
    render.bounds.max.y = targetHeight
    render.options.width = targetWidth
    render.options.height = targetHeight
    render.canvas.width = targetWidth * render.options.pixelRatio
    render.canvas.height = targetHeight * render.options.pixelRatio
    render.canvas.style.width = targetWidth + 'px'
    render.canvas.style.height = targetHeight + 'px'

    // Scale all body positions
    for (const body of world.bodies) {
      Body.setPosition(body, {
        x: body.position.x / (prevWidth / targetWidth),
        y: body.position.y / (prevHeight / targetHeight)
      })
    }

    // Re-spawn logo letters to ensure sizes are synced even with complex CSS styling
    Composite.remove(world, world.bodies.filter(body => body && body.label === 'letter'))
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

    // Temporarily move mouse out of the way
    Body.setPosition(mouse, { x: -1000, y: -1000 })

    const nuts = world.bodies.filter(body => body.label === 'nut').slice(0, 3)
    const clonedNut = Object.assign(
      clone(randomOf(nuts), true),
      { id: Common.nextId() }
    )

    Body.setPosition(clonedNut, getCursorPosition(e))
    Body.setAngle(clonedNut, Math.random() * Math.PI)
    Composite.add(world, clonedNut)
  }

  function logoBodies ({ nut = true } = {}) {
    const bodies = []
    for (const el of logoElement.querySelectorAll('path')) {
      const { left, top, width, height } = el.getBoundingClientRect()
      const isNut = el.classList.contains('nut')
      if (isNut) el.style.display = 'none'
      if (!nut && isNut) continue

      const body = isNut
        ? nutBody(left + width / 2, top + height / 2, width, window.getComputedStyle(el).fill)
        : Bodies.rectangle(left + width / 2, top + height / 2, width, height, {
          label: 'letter',
          isStatic: true,
          render: { visible: debug }
        })
      bodies.push(body)
    }
    return bodies
  }

  function nutBody (x = width / 2, y = height / 2, diameter = randomOf([60, 60, 60, 160]), color = 'black') {
    return Bodies.polygon(x, y, 6, diameter / 2, {
      label: 'nut',
      angle: Math.random() * Math.PI,
      density: 1,
      friction: 1,
      restitution: 0.9,
      collisionFilter: {
        category: collisions.nuts
      },
      render: {
        fillStyle: 'none',
        sprite: {
          texture: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${diameter}' height='${diameter}' viewBox='0 0 100 100'%3E%3Cpath d='M22.011,50C22.011,34.542 34.543,22.012 50.001,22.012C65.459,22.012 77.989,34.542 77.989,50C77.989,65.458 65.459,77.99 50.001,77.99C34.543,77.99 22.011,65.458 22.011,50M93.3,74.999L93.3,24.999L50.001,0L6.7,24.999L6.7,74.999L50.001,100L93.3,74.999Z' fill='${color.replace('#', '%23')}' /%3E%3C/svg%3E%0A`
        }
      }
    })
  }
}
