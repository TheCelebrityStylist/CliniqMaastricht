'use client'

import { useEffect, useRef } from 'react'

// Decorative WebGL ripple burst that plays over the lightbox image whenever the visible photo
// changes (prev/next) — the "reinvented gallery" moment the brief asks for. Deliberately does not
// sample the actual photo as a texture: loading a remote CDN image into a WebGL texture needs
// CORS headers the image hosts may not send, and a failed texture load would either throw or
// silently render black over a real photo. A self-contained ripple field composited with
// mix-blend-mode reads as "distortion on transition" without that risk, and the existing
// swipe/pinch/keyboard navigation this sits on top of is untouched either way.
export default function GalleryDistortion({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<{
    program: import('ogl').Program | null
    renderer: import('ogl').Renderer | null
    mesh: import('ogl').Mesh | null
    raf: number
    started: boolean
  }>({ program: null, renderer: null, mesh: null, raf: 0, started: false })
  const mountedTrigger = useRef(trigger)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const frame = canvas?.parentElement
    if (!canvas || !frame) return

    let destroyed = false
    let cleanupGl: (() => void) | undefined

    async function start() {
      try {
        const { Renderer, Program, Mesh, Triangle } = await import('ogl')
        if (destroyed || !canvas || !frame) return

        const renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) })
        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)

        const geometry = new Triangle(gl)
        const program = new Program(gl, {
          vertex: /* glsl */ `
            attribute vec2 uv;
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `,
          fragment: /* glsl */ `
            precision highp float;
            uniform float uProgress;
            uniform float uDirection;
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main() {
              float aspect = uResolution.x / uResolution.y;
              vec2 uv = (vUv - 0.5) * vec2(aspect, 1.0);

              float dist = length(uv);
              float ring = smoothstep(uProgress - 0.18, uProgress, dist) - smoothstep(uProgress, uProgress + 0.18, dist);
              float sweep = smoothstep(0.0, 1.0, clamp(vUv.x * uDirection + (1.0 - uDirection) * (1.0 - vUv.x) - (1.0 - uProgress) * 1.4, 0.0, 1.0));

              vec3 magenta = vec3(0.941, 0.149, 0.529);
              float alpha = (ring * 0.5 + sweep * 0.12) * (1.0 - uProgress * 0.5);
              gl_FragColor = vec4(magenta * alpha, alpha);
            }
          `,
          uniforms: {
            uProgress: { value: 1 },
            uDirection: { value: 1 },
            uResolution: { value: [1, 1] },
          },
        })
        const mesh = new Mesh(gl, { geometry, program })
        stateRef.current.renderer = renderer
        stateRef.current.program = program
        stateRef.current.mesh = mesh

        function resize() {
          if (!frame) return
          const rect = frame.getBoundingClientRect()
          renderer.setSize(rect.width, rect.height)
          program.uniforms.uResolution.value = [rect.width, rect.height]
          renderer.render({ scene: mesh })
        }
        resize()
        window.addEventListener('resize', resize)
        stateRef.current.started = true

        cleanupGl = () => {
          window.removeEventListener('resize', resize)
          const ext = gl.getExtension('WEBGL_lose_context')
          ext?.loseContext()
        }
      } catch {
        // WebGL unavailable — the real photo swap already happened via React state, nothing lost.
      }
    }

    start()

    return () => {
      destroyed = true
      cancelAnimationFrame(stateRef.current.raf)
      cleanupGl?.()
      stateRef.current.started = false
    }
  }, [])

  useEffect(() => {
    const direction = trigger >= mountedTrigger.current ? 1 : 0
    mountedTrigger.current = trigger
    if (!stateRef.current.started || !stateRef.current.program || !stateRef.current.renderer || !stateRef.current.mesh) return
    const program = stateRef.current.program
    const renderer = stateRef.current.renderer
    const mesh = stateRef.current.mesh
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    program.uniforms.uDirection.value = direction
    const duration = 500
    const startTime = performance.now()
    cancelAnimationFrame(stateRef.current.raf)
    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1)
      program.uniforms.uProgress.value = t
      renderer.render({ scene: mesh })
      if (t < 1) stateRef.current.raf = requestAnimationFrame(tick)
    }
    stateRef.current.raf = requestAnimationFrame(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full mix-blend-screen"
    />
  )
}
