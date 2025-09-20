'use client'

import React from 'react'

interface YouTubeProps {
  videoId?: string
  url?: string
  title?: string
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

const YouTube: React.FC<YouTubeProps> = ({
  videoId,
  url,
  title = 'YouTube video player',
}) => {
  let finalVideoId: string | null = videoId || null

  if (url && !videoId) {
    finalVideoId = extractVideoId(url)
  }

  if (!finalVideoId) {
    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-gray-200 flex items-center justify-center text-gray-500">
        Invalid YouTube URL or video ID
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden mb-6">
      <iframe
        src={`https://www.youtube.com/embed/${finalVideoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  )
}

export default YouTube
