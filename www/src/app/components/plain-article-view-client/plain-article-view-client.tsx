'use client'
import styles from './plain-article-view-client.module.css'
import Link from "next/link";
import Attachment from "../../components/attachment/attachment";
import Header from "@/app/components/header/header";
import Markdown from "@/app/components/markdown/markdown";
import AdminSection from "@/app/components/admin-section/admin-section";


export default function PlainArticleViewClient({
    article,
    deleteAllUnpublishedAttachmentsAction
}) {
    const createAttachmentUrl = `/articles/${article.id}/attachments/create-edit`
    return <div className={styles.plainArticle}>
        <Header minimal={true}/>
        <article className={'article-body'}>
            <header className="article-header" style={{marginBottom: 4}}>
                <div className={'article-supertitle'}>
                    Site News
                </div>
                <h1>{article.original_title}</h1>
            </header>
            <div className={styles.content}>
                {<Markdown text={article.full_text}/>}
            </div>
        </article>
        <br/>
        <AdminSection>
            <div className={'content'}>
                <Link className='button' href={`/articles/${article.id}/edit`}>edit
                    article</Link>
                <h1>Attachments</h1>
                {!article.attachments || article.attachments.length == 0 &&
                    <p>no attachments.</p>}
                {article.attachments.map(attachment =>
                    <Link key={attachment.id}
                          href={`/articles/${article.id}/attachments/${attachment.id}`}>
                        <Attachment article={article} attachment={attachment}
                                    allowMaximize={false} showCaption={false}/>
                    </Link>
                )}
                <br/>
                <p>
                    <Link className={'button'} href={createAttachmentUrl}>
                        Add attachment</Link>
                </p>
            </div>
        </AdminSection>

    </div>
}
