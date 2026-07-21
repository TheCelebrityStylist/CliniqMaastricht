'use client'

import { useEffect, useRef } from 'react'

// Decorative WebGL "light sweep" reveal that plays once over an event's hero photo when it
// scrolls into view — a cinematic beat for event detail pages. Purely additive: the photo
// underneath (SafeImage, passed as children) is the real content and is already in the SSR'd
// DOM, so this canvas can fail or never load without the page ever looking broken. No texture
// sampling of the actual photo (avoids any CORS risk with the image CDN) — the shader draws its
// own animated sweep/grain field, composited with mix-blend-mode so it reads as a light pass
// over the photo rather than a separate layer.
export default function EventImageReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const frame = canvas?.parentElement
    if (!canvas || !frame) return

    let raf = 0
    let destroyed = false
    let cleanupGl: (() => void) | undefined
    let observer: IntersectionObserver | undefined

    async function start() {
      try {
        const { Renderer, Program, Mesh, Triangle } = await import('ogl')
        if (destroyed || !canvas || !frame) return

        const renderer = new Renderer({ canvas, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.75) })
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
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main() {
              float aspect = uResolution.x / uResolution.y;
              vec2 uv = vUv;

              // Diagonal sweep band that travels bottom-left to top-right as uProgress runs 0..1.
              float band = uv.x * aspect + (1.0 - uv.y);
              float sweep = smoothstep(uProgress * 2.6 - 0.5, uProgress * 2.6, band) -
                            smoothstep(uProgress * 2.6, uProgress * 2.6 + 0.5, band);

              vec3 gold = vec3(0.835, 0.710, 0.431);
              float alpha = sweep * 0.5 * (1.0 - uProgress * 0.3);
              gl_FragColor = vec4(gold * alpha, alpha);
            }
          `,
          uniforms: {
            uProgress: { value: 0 },
            uResolution: { value: [1, 1] },
          },
        })
        const mesh = new Mesh(gl, { geometry, program })

        function resize() {
          if (!frame) return
          const rect = frame.getBoundingClientRect()
          renderer.setSize(rect.width, rect.height)
          program.uniforms.uResolution.value = [rect.width, rect.height]
        }
        resize()
        window.addEventListener('resize', resize)

        let played = false
        function playSweep() {
          if (played) return
          played = true
          const duration = 1100
          const start = performance.now()
          function tick(now: number) {
            if (destroyed) return
            const t = Math.min((now - start) / duration, 1)
            program.uniforms.uProgress.value = t
            renderer.render({ scene: mesh })
            if (t < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        }

        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) playSweep()
          },
          { threshold: 0.4 },
        )
        observer.observe(frame)

        cleanupGl = () => {
          window.removeEventListener('resize', resize)
          const ext = gl.getExtension('WEBGL_lose_context')
          ext?.loseContext()
        }
      } catch {
        // WebGL unavailable or failed — the photo underneath is the real content, nothing to fix.
      }
    }

    start()

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      cleanupGl?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full mix-blend-screen"
    />
  )
}
