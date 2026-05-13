import {prisma} from '@/app/lib/prisma'
import ArticleViewClient
    from "../../components/article-view-client/article-view-client.tsx";
import {redirect} from "next/navigation";
import {generateElement} from "../../lib/generation/generate_element.ts";
import PlainArticleViewClient
    from "../../components/plain-article-view-client/plain-article-view-client.tsx";


export default async function ArticleView({id}) {
    const llms = await prisma.llms.findMany({where: {active: true}})
    const article = await prisma.articles.findUnique(
        {
            where: {id},
            include: {
                attachments: {
                    orderBy: [{order: 'asc'}, {created_at: 'desc'}],
                    select: {
                        id: true,
                        caption: true,
                        size: true,
                        width: true,
                        height: true,
                        alt_text: true,
                        type: true,
                        component: true,
                        params: true
                    },
                },
                translations: {
                    include: {llms: true, prompts: true},
                    orderBy: [
                        {published_at: 'asc'},
                        {created_at: 'desc'}
                    ],
                },
                sections: {
                    orderBy: {
                        id: 'asc'
                    },
                    include: {
                        paragraphs: {
                            orderBy: {
                                id: 'asc'
                            }
                        }
                    }
                }
            }
        }
    )

    async function deleteArticleAction() {
        'use server'
        await prisma.articles.delete({
            where: {
                id: article.id
            },
        });
        redirect("/articles")
    }

    async function deleteAllUnpublishedTranslationsAction() {
        'use server'
        await prisma.translations.deleteMany({
            where: {
                article_id: article.id,
                published_at: null
            }
        })
        redirect(`/articles/${article.id}`)
    }

    async function deleteAllUnpublishedAttachmentsAction(type = null) {
        'use server'
        const typeWhereClause = type ? {type} : {}
        await prisma.attachments.deleteMany({
            where: {
                article_id: article.id,
                active: false,
                ...typeWhereClause,
            }
        })
        console.log("deleteAllUnpublishedAttachmentsAction 1")
        redirect(`/articles/${article.id}`)
    }

    async function deleteClaimsAction() {
        'use server'
        await prisma.articles.update({
                where: {id: article.id},
                data: {
                    claims: null
                }
            }
        )
        redirect(`/articles/${article.id}`)
    }


    async function generateElement_(elementName, llmName = "claude-haiku-latest", params = {}) {
        'use server'
        const STREAMING = true;
        const response = await generateElement(elementName, llmName,
            {...params, stream: STREAMING, save: true, articleId: article.id})
        if (STREAMING) {
            return response;
        } else {
            redirect(`/articles/${article.id}`)

        }
    }

    return article.type === 'plain' ? <PlainArticleViewClient
            article={article}
            deleteAllUnpublishedAttachmentsAction={deleteAllUnpublishedAttachmentsAction}
        />
        : <ArticleViewClient
            llms={llms}
            article={article}
            generateElement={generateElement_}
            deleteArticleAction={deleteArticleAction}
            deleteAllUnpublishedTranslationsAction={deleteAllUnpublishedTranslationsAction}
            deleteAllUnpublishedAttachmentsAction={deleteAllUnpublishedAttachmentsAction}
            deleteClaimsAction={deleteClaimsAction}
        />

}
