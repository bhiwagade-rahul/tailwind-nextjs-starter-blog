import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Carousel from '@/components/Carousel'
import CategoryColumn from '@/components/CategoryColumn'
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

  // Categorize posts
  const hollywoodPosts = posts.filter(
    (post) => post.tags && post.tags.some((tag) => tag.toLowerCase().includes('hollywood'))
  )

  const worldPosts = posts.filter(
    (post) =>
      post.tags &&
      post.tags.some(
        (tag) =>
          tag.toLowerCase().includes('canada') ||
          tag.toLowerCase().includes('holiday') ||
          tag.toLowerCase().includes('travel')
      )
  )

  const exclusivePosts = posts.filter(
    (post) =>
      post.tags &&
      post.tags.some(
        (tag) =>
          tag.toLowerCase().includes('images') ||
          tag.toLowerCase().includes('exclusive') ||
          tag.toLowerCase().includes('feature')
      )
  )

  return (
    <>
      {/* Carousel Section */}
      {carouselItems.length > 0 && (
        <div className="mb-12">
          <Carousel items={carouselItems} />
        </div>
      )}

      {/* Category Columns */}
      <div className="mb-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <CategoryColumn
          title="Hollywood"
          posts={hollywoodPosts}
          categoryColor="#DC2626" // Red
        />
        <CategoryColumn
          title="World"
          posts={worldPosts}
          categoryColor="#2563EB" // Blue
        />
        <CategoryColumn
          title="Exclusive"
          posts={exclusivePosts}
          categoryColor="#7C3AED" // Purple
        />
      </div>

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
                  className="focus:ring-primary-500 flex h-full flex-col focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  aria-label={`Read more: "${title}"`}
                >
                  {/* Image Section - 60% of card height */}
                  {hasImage && (
                    <div className="relative h-0 overflow-hidden pb-[60%]">
                      {images.length === 1 ? (
                        // Single image
                        <Image
                          src={images[0]}
                          alt={title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        // Multiple images - grid layout
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
                                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black">
                                  <span className="text-sm font-medium text-white">
                                    +{images.length - 1}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Section - Remaining space (40% when image present, 100% when no image) */}
                  <div className={`flex flex-col ${hasImage ? 'flex-1 p-4' : 'flex-1 p-6'}`}>
                    {/* Date */}
                    <time dateTime={date} className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(date, siteMetadata.locale)}
                    </time>

                    {/* Title */}
                    <h2 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-2 text-lg leading-tight font-bold text-gray-900 transition-colors dark:text-gray-100">
                      {title}
                    </h2>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>

                    {/* Summary */}
                    <p
                      className={`flex-1 text-sm text-gray-600 dark:text-gray-300 ${hasImage ? 'line-clamp-2' : 'line-clamp-3'}`}
                    >
                      {summary}
                    </p>

                    {/* Read More Indicator */}
                    <div className="text-primary-600 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-300 mt-4 flex items-center text-sm font-medium transition-colors">
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
