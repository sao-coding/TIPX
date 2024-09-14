import { Metadata } from 'next'

import { site } from '@/config/site'
import { Post } from '@/types'
import getPost from '@/utils/post'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = (await getPost('one', Number(params.id))) as Post
  if (!post) return { title: '404 Not Found' }

  return {
    title: post.title,
    description: post.content.slice(0, 100) + '...',
    keywords: post.title,
    openGraph: {
      title: post.title,
      description: post.content,
      url: `${site.url}/post/${params.id}`,
      type: 'article',
      publishedTime: post.date,
      expirationTime: post.deadline,
      authors: [post.publisher.name],
      tags: [post.category],
      images: [
        {
          url: `${site.url}/api/og/?title=${post.title}&date=${post.date}`,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png'
        }
      ]
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
