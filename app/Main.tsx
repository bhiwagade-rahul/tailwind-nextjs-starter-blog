import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Carousel from '@/components/Carousel'
import Image from 'next/image'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  // Prepare carousel data - get posts with images
  const carouselItems = posts
    .filter((post) => post.images && post.images.length > 0)
    .slice(0, 5) // Limit to 5 items for carousel
    .map((post) => ({
      title: post.title,
      image: post.images[0], // Use first image
      slug: post.slug,
    }))

  return (
    <>
      {/* Carousel Section */}
      {carouselItems.length > 0 && (
        <div className="mb-12">
          <Carousel items={carouselItems} />
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            Latest
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, images } = post
            const hasImage = images && images.length > 0

            return (
              <article
                key={slug}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Link
                  href={`/blog/${slug}`}
                  className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`Read more: "${title}"`}
                >
                  {/* Post Images */}
                  {hasImage ? (
                    images.length === 1 ? (
                      // Single image - full width
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={images[0]}
                          alt={title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      // Multiple images - grid layout
                      <div className="aspect-video overflow-hidden">
                        <div className="grid h-full grid-cols-2 gap-1 p-1">
                          {/* First image - takes up left side */}
                          <div className="relative overflow-hidden rounded">
                            <Image
                              src={images[0]}
                              alt={`${title} - Image 1`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                            />
                          </div>

                          {/* Second image or collage of remaining images */}
                          <div className="relative overflow-hidden rounded">
                            {images.length === 2 ? (
                              <Image
                                src={images[1]}
                                alt={`${title} - Image 2`}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              />
                            ) : (
                              // Multiple images collage
                              <div className="relative h-full">
                                <Image
                                  src={images[1]}
                                  alt={`${title} - Image 2`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                />
                                {/* Overlay showing number of additional images */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    +{images.length - 1}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center text-gray-400 dark:text-gray-500">
                          <svg
                            className="mx-auto h-12 w-12"
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
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Date */}
                    <time
                      dateTime={date}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {formatDate(date, siteMetadata.locale)}
                    </time>

                    {/* Title */}
                    <h2 className="mt-2 text-xl font-bold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {title}
                    </h2>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="mt-3 flex-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {summary}
                    </p>

                    {/* Read More Indicator */}
                    <div className="mt-4 flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 transition-colors">
                      Read more
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
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
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
