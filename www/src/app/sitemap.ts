import type { MetadataRoute } from 'next'
import { prisma } from '@/app/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const translations = await prisma.translations.findMany({
    select: {
      id: true,
      updated_at: true,
    },
    orderBy: { id: 'desc' },
  })

  const translationEntries: MetadataRoute.Sitemap = translations.map((t) => ({
    url: `https://www.thekabukipapers.org/translations/${t.id}`,
    lastModified: t.updated_at ?? undefined,
  }))

  return [
    {
      url: 'https://www.thekabukipapers.org',
      lastModified: new Date(),
    },
    ...translationEntries,
  ]
}
