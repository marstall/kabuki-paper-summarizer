import {loadArticle} from "@/app/lib/load-article";
import {prisma} from "@/app/lib/prisma";
import IngestViewClient
    from "@/app/components/ingest-view-client/ingest-view-client";

async function saveSectionsAndParagraphs(article, sections, sectionsToParagraphsMap) {
    'use server'
    for (const section of sections) {
        const new_section = await prisma.sections.create({
            data: {
                created_at: new Date(),
                updated_at: new Date(),
                title: section,
                articles: {connect: {id: BigInt(article.id)}}
            }
        })
        if (sectionsToParagraphsMap[section]) {
            for (const paragraph of sectionsToParagraphsMap[section]) {
                const new_paragraph = await prisma.paragraphs.create({
                    data: {
                        created_at: new Date(),
                        updated_at: new Date(),
                        body: paragraph,
                        sections: {connect: {id: BigInt(new_section.id)}}
                    }
                })
            }
        }
    }
}

export default async function IngestView({article_id}: any) {
    const article = await loadArticle(article_id)
    return <IngestViewClient
        article={article}
        saveSectionsAndParagraphs={saveSectionsAndParagraphs}
    />
}