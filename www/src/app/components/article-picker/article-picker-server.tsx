"use server"
import {prisma} from "@/app/lib/prisma";

export default async function getArticles() {
    return await prisma.articles.findMany(
        {
            where:
                {
                    OR:
                        [
                            {type: null},
                            {NOT: {type: 'plain'}}
                        ]
                },
            orderBy: {id: 'desc'}
        })
}
