'use client'
import {useEffect, useState} from "react";
import getArticles from "@/app/components/article-picker/article-picker-server";

export default function ArticlePickerClient({
    articleId,
    //setArticleId,
    setArticle
}) {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles().then(setArticles)
    }, [])
    return <select className='select'
                   value={articleId}
                   onChange={(e) => setArticle(articles.find(a => `${a.id}` === e.target.value))}
                   name={'article_id'}>
        <option value={""}></option>
        {articles.map(article => {
                return <option value={article.id}
                               key={article.id}>{article.title || article.original_title}</option>
            }
        )}
    </select>
}
