"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  type: 'circle' | 'dumbbell' | 'heart'
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: Particle[] = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        type: ['circle', 'dumbbell', 'heart'][Math.floor(Math.random() * 3)] as Particle['type']
      })
    }

    const drawDumbbell = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)'
      ctx.lineWidth = size / 3
      ctx.lineCap = 'round'
      
      ctx.beginPath()
      ctx.moveTo(x - size, y)
      ctx.lineTo(x + size, y)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(x - size, y, size / 2, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(x + size, y, size / 2, 0, Math.PI * 2)
      ctx.stroke()
      
      ctx.restore()
    }

    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = 'rgba(236, 72, 153, 0.5)'
      ctx.beginPath()
      ctx.moveTo(x, y + size / 4)
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.7, x, y + size * 0.7)
      ctx.bezierCurveTo(x, y + size * 0.7, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        if (particle.type === 'circle') {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`
          ctx.fill()
        } else if (particle.type === 'dumbbell') {
          drawDumbbell(particle.x, particle.y, particle.size * 2, particle.opacity)
        } else {
          drawHeart(particle.x, particle.y, particle.size * 2, particle.opacity)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
