import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gridSize = 60
      const offsetX = (time * 0.2) % gridSize
      const offsetY = (time * 0.1) % gridSize

      ctx.strokeStyle = 'rgba(100, 120, 140, 0.08)'
      ctx.lineWidth = 0.5

      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Perspective effect - horizontal lines get closer at bottom
      const horizonY = canvas.height * 0.4
      const perspectiveLines = 20

      for (let i = 0; i < perspectiveLines; i++) {
        const progress = i / perspectiveLines
        const y = horizonY + (canvas.height - horizonY) * (progress * progress)
        const alpha = 0.03 * (1 - progress)

        ctx.strokeStyle = `rgba(100, 120, 140, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      time += 1
      animationId = requestAnimationFrame(drawGrid)
    }

    resize()
    drawGrid()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
