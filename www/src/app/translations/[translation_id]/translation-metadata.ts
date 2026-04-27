import {loadTranslation} from "@/app/lib/load-translation"

export default async function generateTranslationMetadata(params) {
  const _params = await params
  console.log({_params})
  const translation = await loadTranslation(_params['translation_id'])
  const ret = {
    title: translation.articles.title,
    description: translation.articles.second_title,
    alternates: { canonical: null },
    openGraph: {
      title: translation.articles.title,
      description: translation.articles.second_title,
      images: [
        {
//          url: "https://www.thekabukipapers.org/site_logo_1200x630.png",
          url: `https://www.thekabukipapers.org/api/translation/${translation.id}/share-image`,
          width: 1200,
          height: 630
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: "summary_large_image",
      title:translation.articles.title,
      description:translation.articles.second_title,
      images: [`https://www.thekabukipapers.org/api/translation/${translation.id}/share-image`],
    },
  }
  console.log({ret})
  return ret;
}
