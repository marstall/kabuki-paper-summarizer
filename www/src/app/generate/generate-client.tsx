'use client'

import LlmPickerClient from "@/app/components/llm-picker/llm-picker-client";
import {useState} from "react";
import ArticlePickerClient from "@/app/components/article-picker/article-picker-client";
import HeadlinesGenerator from "@/app/lib/generation/generators/headlines_generator";
import ClaimsGenerator from "@/app/lib/generation/generators/claims_generator";
import ArticleTranslationGenerator from "@/app/lib/generation/generators/article_translation_generator";
import AttachmentCaptionGenerator from "@/app/lib/generation/generators/attachment_caption_generator";
import SatoriAttachmentGenerator from "@/app/lib/generation/generators/satori_attachment_generator";
import ChatExchangeAttachmentsGenerator
    from "@/app/lib/generation/generators/chat_exchange_panel_attachments_generator";
import StatefulPicker from "@/app/components/stateful-picker/stateful-picker";
export default function GenerateClient(params) {
    const [llmName, setLlmName] = useState("deepseek")
    const [articleId, setArticleId] = useState(null)
    const [generator, setGenerator] = useState(null)
    return <div>
        <div>llmName: {llmName}</div>
        <LlmPickerClient llmName={llmName} setLlmName={setLlmName}/>
        <div>articleId: {articleId}</div>
        <ArticlePickerClient setArticleId={setArticleId}/>
        <div>generator: {generator}</div>
        <StatefulPicker
            values={[
                "",
                "headlines",
                "claims",
                "article-translation",
                "chat-exchange-panel-attachments"
            ]}
            value={generator}
            setter={setGenerator}
        />
    </div>
}
