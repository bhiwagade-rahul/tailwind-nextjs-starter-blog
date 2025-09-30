'use client'

import React from 'react'

interface YouTubeProps {
  videoId?: string
  url?: string
  title?: string
  className?: string
}

const extractVideoId = (url: string): string | null => {
  // Handle different YouTube URL formats
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // Try URL parsing as fallback
  try {
    const urlObj = new URL(url)

    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }

    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v')
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/embed/')[1]
      }
    }
  } catch (e) {
    // URL parsing failed
  }

  return null
}

const YouTube: React.FC<YouTubeProps> = ({ videoId, url, title = 'YouTube video player', className = '' }) => {
  let finalVideoId: string | null = videoId || null

  if (url && !videoId) {
    finalVideoId = extractVideoId(url)
  }

  if (!finalVideoId) {
    console.error('Invalid YouTube URL or video ID:', url || videoId)
    return (
      <div className={`mb-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`}>
        <div className="text-center">
          <p>Unable to load YouTube video</p>
          <p className="text-sm mt-1">Invalid URL or video ID</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`mb-6 aspect-video w-full overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${finalVideoId}?modestbranding=1&rel=0&showinfo=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-same-origin allow-scripts allow-presentation"
      />
    </div>
  )
}

export default YouTube
