'use client'
import styles from './translation-picker.module.css'
import {useEffect, useState} from "react";
import getTranslations from "./translation-picker-server";

export default function TranslationPickerClient({
    articleId,
    translationId,
    setTranslation
}) {
    const [translations, setTranslations] = useState([]);
    useEffect(() => {
        getTranslations(articleId).then((translations) => {
            console.log("useEfect translations ", translations)
            setTranslations(translations)
        })
    }, [articleId])

    return <select
        className='select'
        value={translationId}
        onChange={(e) => setTranslation(translations.find(a => `${a.id}` === e.target.value))}
        name={'article_id'}>
        <option value={""}></option>
        {translations.map(translation => {
                const published = translation.published_at ? "✅" : ""
                return <option value={translation.id}
                               key={translation.id}>({translation.id}) {published} {translation.body?.substring(0, 50)}</option>
            }
        )}
    </select>
}
