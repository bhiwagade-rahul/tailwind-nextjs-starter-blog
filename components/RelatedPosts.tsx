import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Image from './Image'
import Link from './Link'

interface RelatedPostsProps {
  currentPostSlug: string
  tags: string[]
}

export default function RelatedPosts({ currentPostSlug, tags }: RelatedPostsProps) {
  const allPosts = allCoreContent(sortPosts(allBlogs))

  // Determine category based on tags
  const isCelebverse = tags?.some((tag) =>
    tag.toLowerCase().includes('hollywood') ||
    tag.toLowerCase().includes('celebrity') ||
    tag.toLowerCase().includes('celeb') ||
    tag.toLowerCase().includes('actor') ||
    tag.toLowerCase().includes('actress')
  )

  const isGossips = tags?.some((tag) =>
    tag.toLowerCase().includes('gossip') ||
    tag.toLowerCase().includes('news') ||
    tag.toLowerCase().includes('entertainment') ||
    tag.toLowerCase().includes('scandal') ||
    tag.toLowerCase().includes('buzz')
  )

  // Filter related posts based on category
  let relatedPosts = allPosts.filter((post) => post.slug !== currentPostSlug)

  if (isCelebverse) {
    relatedPosts = relatedPosts.filter((post) =>
      post.tags && post.tags.some((tag) =>
        tag.toLowerCase().includes('hollywood') ||
        tag.toLowerCase().includes('celebrity') ||
        tag.toLowerCase().includes('celeb') ||
        tag.toLowerCase().includes('actor') ||
        tag.toLowerCase().includes('actress')
      )
    )
  } else if (isGossips) {
    relatedPosts = relatedPosts.filter((post) =>
      post.tags && post.tags.some((tag) =>
        tag.toLowerCase().includes('gossip') ||
        tag.toLowerCase().includes('news') ||
        tag.toLowerCase().includes('entertainment') ||
        tag.toLowerCase().includes('scandal') ||
        tag.toLowerCase().includes('buzz')
      )
    )
  } else {
    // For blog posts, show other blog posts (exclude celebverse and gossips)
    relatedPosts = relatedPosts.filter((post) => {
      if (!post.tags) return true
      return !post.tags.some((tag) =>
        tag.toLowerCase().includes('hollywood') ||
        tag.toLowerCase().includes('celebrity') ||
        tag.toLowerCase().includes('celeb') ||
        tag.toLowerCase().includes('actor') ||
        tag.toLowerCase().includes('actress') ||
        tag.toLowerCase().includes('gossip') ||
        tag.toLowerCase().includes('news') ||
        tag.toLowerCase().includes('entertainment') ||
        tag.toLowerCase().includes('scandal') ||
        tag.toLowerCase().includes('buzz')
      )
    })
  }

  // Limit to 6 related posts
  relatedPosts = relatedPosts.slice(0, 6)

  // For debugging - show at least some posts even if few
  if (relatedPosts.length === 0) {
    // If no related posts in same category, show recent posts from any category
    relatedPosts = allPosts
      .filter((post) => post.slug !== currentPostSlug)
      .slice(0, 3)
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold leading-8 tracking-tight mb-6">You may have missed</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {relatedPosts.map((post) => (
          <div key={post.slug} className="flex-shrink-0 w-72">
            <div className="h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              {post.images?.[0] && (
                <Link href={`/${post.slug}`} aria-label={`Link to ${post.title}`}>
                  <Image
                    alt={post.title}
                    src={post.images[0]}
                    className="object-cover object-center w-full h-40"
                    width={288}
                    height={160}
                  />
                </Link>
              )}
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold leading-6 line-clamp-2">
                  <Link
                    href={`/${post.slug}`}
                    aria-label={`Link to ${post.title}`}
                    className="text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                  {post.summary}
                </p>
                <Link
                  href={`/${post.slug}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
                  aria-label={`Read more about ${post.title}`}
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
