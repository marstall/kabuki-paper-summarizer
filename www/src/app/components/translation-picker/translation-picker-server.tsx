"use server"
import {prisma} from "@/app/lib/prisma";

export default async function getTranslations(articleId) {
    const translations = await prisma.translations.findMany(
        {
            where: {
                article_id: articleId
            },
            orderBy: {id: 'desc'}
        })
    console.log({translations})
    return translations;
}
