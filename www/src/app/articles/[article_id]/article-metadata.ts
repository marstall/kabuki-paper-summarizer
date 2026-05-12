import {loadArticle} from "@/app/lib/load-article";

export default async function generateArticleMetadata(params) {
    const _params = await params
    const article = await loadArticle(_params['article_id'])
    const ret = {
        title: article.original_title,
        alternates: {canonical: null},
        openGraph: {
            title: article.title || article.original_title,
            description: article.second_title,
            images: [
                {
                    url: `https://www.thekabukipapers.org/api/translation/${article.id}/share-image`,
                    width: 1200,
                    height: 630
                }
            ],
            locale: 'en_US',
            type: 'website'
        },
        twitter: {
            card: "summary_large_image",
            title: article.title || article.original_title,
            description: article.second_title,
            images: [`https://www.thekabukipapers.org/api/article/${article.id}/share-image`],
        },
    }
    console.log({ret})
    return ret;
}
