import {loadArticle} from "@/app/lib/load-article";
import IngestViewClient
    from "@/app/components/ingest-view-client/ingest-view-client";

export default async function IngestView({article_id}: any) {
    const article = await loadArticle(article_id)
    return <IngestViewClient article={article}/>
}