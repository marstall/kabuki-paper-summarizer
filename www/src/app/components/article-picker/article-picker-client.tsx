'use client'
import styles from '@/app/components/article-picker/article-picker.module.css'
import {useEffect, useState} from "react";
import getArticles from "@/app/components/article-picker/article-picker-server";

export default function ArticlePickerClient({articleId, setArticleId}) {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getArticles().then(setArticles)
    }, [])
    return <select className='select'
                   value={articleId}
                   onChange={(e) => setArticleId(e.target.value)}
                   name={'article_id'}>
        <option value={""}></option>
        {articles.map(article => {
                return <option value={article.id} key={article.id}>{article.title || article.original_title}</option>
            }
        )}
    </select>
}
