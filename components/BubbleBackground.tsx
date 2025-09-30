'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface BubbleBackgroundProps {
  className?: string
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  // Reset bubbles on pathname change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Bubble properties - matching CodePen style
    let bubbles: Array<{
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      opacitySpeed: number
    }> = []

    // Create bubbles - 9-10 bubbles total
    const createBubbles = () => {
      const bubbleCount = 10 // Fixed number

      bubbles = [] // Reset array
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 40 + 20, // Good sizes
          speed: Math.random() * 0.1 + 0.02, // Very slow movement
          opacity: Math.random() * 0.3 + 0.1, // Subtle opacity
          opacitySpeed: Math.random() * 0.005 + 0.001, // Very slow fading
        })
      }
    }

    createBubbles()

    // Animation loop - matching original CodePen
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((bubble) => {
        // Update bubble position
        bubble.y -= bubble.speed

        // Update opacity for very slow pulsing effect
        bubble.opacity += bubble.opacitySpeed
        if (bubble.opacity >= 0.4 || bubble.opacity <= 0.1) {
          bubble.opacitySpeed = -bubble.opacitySpeed
        }

        // Reset bubble if it goes off screen
        if (bubble.y + bubble.radius < 0) {
          bubble.y = canvas.height + bubble.radius
          bubble.x = Math.random() * canvas.width
        }

        // Draw main bubble - bright blue like original
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${bubble.opacity})`
        ctx.fill()

        // Add highlight - lighter blue
        ctx.beginPath()
        ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${bubble.opacity * 1.2})`
        ctx.fill()

        // Add border - darker blue
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(29, 78, 216, ${bubble.opacity * 0.8})`
        ctx.lineWidth = 2
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [pathname])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}

export default BubbleBackground
