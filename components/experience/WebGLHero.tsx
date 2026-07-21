'use client'

import { useEffect, useRef } from 'react'

// Living light-field shader — soft, moving colour blobs (brand magenta/gold) composited over the
// existing hero photo via an alpha-blended canvas. Purely decorative: the photo underneath is the
// real content and is already in the DOM/SSR'd, so this can fail, be skipped, or never load
// without the hero ever looking broken or shifting layout (canvas is absolutely positioned inside
// a section that already has a fixed min-height).
export default function WebGLHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const section = canvas?.closest('section')
    if (!canvas || !section) return

    let raf = 0
    let destroyed = false
    let cleanupGl: (() => void) | undefined

    async function start() {
      try {
        const { Renderer, Program, Mesh, Triangle } = await import('ogl')
        if (destroyed || !canvas || !section) return

        const isMobile = window.innerWidth < 768
        const renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2) })
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
            uniform float uTime;
            uniform vec2 uMouse;
            uniform vec2 uResolution;
            uniform float uIntensity;
            varying vec2 vUv;

            const vec3 magenta = vec3(0.941, 0.149, 0.529);
            const vec3 gold = vec3(0.835, 0.710, 0.431);

            float blob(vec2 uv, vec2 center, float radius) {
              float d = length(uv - center);
              return smoothstep(radius, 0.0, d);
            }

            void main() {
              float aspect = uResolution.x / uResolution.y;
              vec2 auv = vec2(vUv.x * aspect, vUv.y);
              vec2 amouse = vec2(uMouse.x * aspect, uMouse.y);
              float t = uTime * 0.06;

              vec2 p1 = vec2(0.32 + sin(t * 1.3) * 0.16, 0.42 + cos(t * 1.1) * 0.16) * vec2(aspect, 1.0);
              vec2 p2 = vec2(0.68 + cos(t * 0.8) * 0.18, 0.58 + sin(t * 1.4) * 0.14) * vec2(aspect, 1.0);

              float b1 = blob(auv, p1, 0.38);
              float b2 = blob(auv, p2, 0.30);
              float b3 = blob(auv, amouse, 0.24);

              vec3 color = magenta * b1 * 0.55 + gold * b2 * 0.4 + magenta * b3 * 0.45;
              float alpha = clamp((b1 * 0.5 + b2 * 0.38 + b3 * 0.42) * uIntensity, 0.0, 0.8);

              gl_FragColor = vec4(color * alpha, alpha);
            }
          `,
          uniforms: {
            uTime: { value: 0 },
            uMouse: { value: [0.5, 0.35] },
            uResolution: { value: [1, 1] },
            uIntensity: { value: isMobile ? 0.6 : 1 },
          },
        })
        const mesh = new Mesh(gl, { geometry, program })

        function resize() {
          if (!section) return
          const rect = section.getBoundingClientRect()
          renderer.setSize(rect.width, rect.height)
          program.uniforms.uResolution.value = [rect.width, rect.height]
        }
        resize()
        window.addEventListener('resize', resize)

        function onPointerMove(event: PointerEvent) {
          const rect = section!.getBoundingClientRect()
          program.uniforms.uMouse.value = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height]
        }
        function onScroll() {
          const rect = section!.getBoundingClientRect()
          const progress = Math.min(Math.max(1 - rect.top / (window.innerHeight || 1), 0), 1)
          program.uniforms.uMouse.value = [0.5, 0.3 + progress * 0.3]
        }
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('scroll', onScroll, { passive: true })

        const start = performance.now()
        function update(now: number) {
          if (destroyed) return
          program.uniforms.uTime.value = (now - start) / 1000
          renderer.render({ scene: mesh })
          raf = requestAnimationFrame(update)
        }
        raf = requestAnimationFrame(update)

        cleanupGl = () => {
          window.removeEventListener('resize', resize)
          window.removeEventListener('pointermove', onPointerMove)
          window.removeEventListener('scroll', onScroll)
          const ext = gl.getExtension('WEBGL_lose_context')
          ext?.loseContext()
        }
      } catch {
        // WebGL unavailable or failed to init — the hero photo underneath is the real content,
        // so there is nothing to recover: just don't animate the canvas.
      }
    }

    start()

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      cleanupGl?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[9] h-full w-full opacity-90 mix-blend-screen"
    />
  )
}
