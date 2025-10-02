'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface ParticleFieldProps {
  className?: string
}

const ParticleField: React.FC<ParticleFieldProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

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

    // Particle properties for entertainment theme
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      opacitySpeed: number
      type: 'star' | 'sparkle' | 'dot'
    }> = []

    // Create particles
    const createParticles = () => {
      const particleCount = 15 // Fewer, more impactful particles

      particles = []
      for (let i = 0; i < particleCount; i++) {
        const types: Array<'star' | 'sparkle' | 'dot'> = ['star', 'sparkle', 'dot']
        const type = types[Math.floor(Math.random() * types.length)]

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Gentle horizontal drift
          vy: Math.random() * 0.2 + 0.1, // Slow upward movement
          size: Math.random() * 6 + 2, // Larger particles for visibility
          opacity: Math.random() * 0.4 + 0.2,
          opacitySpeed: Math.random() * 0.01 + 0.005,
          type: type,
        })
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y -= particle.vy

        // Update opacity for twinkling effect
        particle.opacity += particle.opacitySpeed
        if (particle.opacity >= 0.6 || particle.opacity <= 0.2) {
          particle.opacitySpeed = -particle.opacitySpeed
        }

        // Reset particle if it goes off screen
        if (particle.y < -10 || particle.x < -10 || particle.x > canvas.width + 10) {
          particle.y = canvas.height + 10
          particle.x = Math.random() * canvas.width
        }

        // Draw different particle types
        ctx.save()
        ctx.globalAlpha = particle.opacity

        if (particle.type === 'star') {
          // Draw star shape
          ctx.fillStyle = '#fbbf24' // Gold color for stars
          const spikes = 5
          const outerRadius = particle.size * 2
          const innerRadius = particle.size

          ctx.beginPath()
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (i * Math.PI) / spikes
            const x = particle.x + Math.cos(angle) * radius
            const y = particle.y + Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
        } else if (particle.type === 'sparkle') {
          // Draw sparkle/diamond shape
          ctx.fillStyle = '#e879f9' // Pink/magenta for sparkles
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y - particle.size * 1.5)
          ctx.lineTo(particle.x + particle.size, particle.y - particle.size * 0.5)
          ctx.lineTo(particle.x + particle.size * 1.5, particle.y)
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size * 0.5)
          ctx.lineTo(particle.x, particle.y + particle.size * 1.5)
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size * 0.5)
          ctx.lineTo(particle.x - particle.size * 1.5, particle.y)
          ctx.lineTo(particle.x - particle.size, particle.y - particle.size * 0.5)
          ctx.closePath()
          ctx.fill()
        } else {
          // Draw glowing dot
          ctx.fillStyle = '#06b6d4' // Cyan for dots
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Add glow effect
          ctx.shadowBlur = 10
          ctx.shadowColor = '#06b6d4'
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          return
        }

        ctx.restore()
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
      className={`pointer-events-none fixed inset-0 z-[1] ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}

export default ParticleField
