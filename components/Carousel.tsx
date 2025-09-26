'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/Link'
import Image from '@/components/Image'

interface CarouselItem {
  title: string
  image: string
  slug: string
}

interface CarouselProps {
  items: CarouselItem[]
}

export default function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [items.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
      {/* Main carousel container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="relative w-full flex-shrink-0">
            <Image
              priority={false}
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => console.error('Image failed to load:', item.image)}
              onLoad={() => console.log('Image loaded successfully:', item.image)}
            />
            {/* Title overlay without black background */}
            <div className="absolute right-0 bottom-0 left-0 z-10">
              <div className="bg-gradient-to-t from-black via-black/50 to-transparent p-6">
                <Link href={`/blog/${item.slug}`}>
                  <h2 className="hover:text-primary-400 text-2xl font-bold text-white drop-shadow-lg transition-colors md:text-3xl">
                    {item.title}
                  </h2>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition-all"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="bg-opacity-50 hover:bg-opacity-75 absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white transition-all"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-opacity-50 bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
