import {prisma} from "./prisma";
import {cache} from "react";

/*
    const translation = await prisma.translations.findUnique({
        where: {id: translationId},
        select: {
            id: true,
            article_id: true,
            title: true,
            second_title: true,
            body: true,
        }
    })
 */
export const loadArticle = cache(async (article_id) => {
    return prisma.articles.findUnique({
            where: {id: article_id},
            include: {
                attachments: {
                    where: {active: true},
                    orderBy: {order: 'asc'},
                    select: {
                        id: true,
                        caption: true,
                        size: true,
                        width: true,
                        height: true,
                        type: true,
                        component: true,
                        params: true,
                        active: true,
                        order: true,
                        alt_text: true
                    }
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
                    },
                }
            }
        }
    )
})
