import ArticleView from './article-view'
import type {ResolvingMetadata} from "next";
import type {Metadata} from "next";
import generateArticleMetadata from "./article-metadata";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    return generateArticleMetadata(params);
}


export default async function Page({params}) {
    const {article_id} = await params;
    return <ArticleView id={article_id}/>
}
