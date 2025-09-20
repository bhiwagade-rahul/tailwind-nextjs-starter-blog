'use client'

import Link from '@/components/Link'
import Image from '@/components/Image'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

interface Post {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  images?: string[]
}

interface CategoryColumnProps {
  title: string
  posts: Post[]
  categoryColor: string
}

export default function CategoryColumn({ title, posts, categoryColor }: CategoryColumnProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className={`mb-4 flex items-center border-b-2 pb-2`} style={{ borderColor: categoryColor }}>
        <h2 className="text-xl font-bold" style={{ color: categoryColor }}>
          {title}
        </h2>
        <div className="ml-2 flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.slice(0, 5).map((post) => {
          const hasImage = post.images && post.images.length > 0
          const imageUrl = hasImage ? post.images![0] : null

          return (
            <article
              key={post.slug}
              className="group flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {imageUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                    <svg
                      className="h-6 w-6 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`Read more: "${post.title}"`}
                >
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                    {post.title}
                  </h3>
                </Link>

                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <time dateTime={post.date}>
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{post.tags[0]}</span>
                    </>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-600 line-clamp-2 dark:text-gray-300">
                  {post.summary}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </article>
          )
        })}
      </div>

      {/* View More Link */}
      {posts.length > 5 && (
        <div className="mt-4 text-center">
          <Link
            href={`/tags/${title.toLowerCase()}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View more {title} →
          </Link>
        </div>
      )}
    </div>
  )
}
