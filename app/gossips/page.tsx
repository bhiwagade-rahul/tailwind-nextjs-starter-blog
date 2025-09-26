import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from '../Main'

export default async function GossipsPage() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Filter posts for Gossips (gossip and entertainment news)
  const gossipsPosts = posts.filter(
    (post) =>
      post.tags &&
      post.tags.some(
        (tag) =>
          tag.toLowerCase().includes('gossip') ||
          tag.toLowerCase().includes('news') ||
          tag.toLowerCase().includes('entertainment') ||
          tag.toLowerCase().includes('scandal') ||
          tag.toLowerCase().includes('buzz')
      )
  )

  return <Main posts={gossipsPosts} />
}

export const metadata = {
  title: 'Gossips! - Latest Entertainment News & Buzz',
  description:
    'Stay updated with the latest entertainment news, celebrity gossip, and breaking stories from the world of showbiz.',
}
