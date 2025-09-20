import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from '../Main'

export default async function CelebversePage() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Filter posts for Celebverse (celebrity-related content)
  const celebversePosts = posts.filter((post) =>
    post.tags && post.tags.some((tag) =>
      tag.toLowerCase().includes('hollywood') ||
      tag.toLowerCase().includes('celebrity') ||
      tag.toLowerCase().includes('celeb') ||
      tag.toLowerCase().includes('actor') ||
      tag.toLowerCase().includes('actress')
    )
  )

  return <Main posts={celebversePosts} />
}

export const metadata = {
  title: 'Celebverse - Celebrity News & Entertainment',
  description: 'Your ultimate destination for celebrity news, Hollywood updates, and entertainment gossip.',
}
