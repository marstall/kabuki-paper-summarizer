import {log} from "@/app/lib/logger";
import LlmGenerator from "./llm_generator";
import HeadlinesGenerator from "./generators/headlines_generator";
import ClaimsGenerator from "./generators/claims_generator";
import ArticleTranslationGenerator from "./generators/article_translation_generator";
import AttachmentCaptionGenerator from "@/app/lib/generation/generators/attachment_caption_generator";
import SatoriAttachmentGenerator from "@/app/lib/generation/generators/satori_attachment_generator";
import ChatExchangeAttachmentsGenerator from "@/app/lib/generation/generators/chat_exchange_panel_attachments_generator";

const generatorMap = {
  "headlines": HeadlinesGenerator,
  "claims": ClaimsGenerator,
  "article-translation": ArticleTranslationGenerator,
  "attachment-caption": AttachmentCaptionGenerator,
  "satori-attachment": SatoriAttachmentGenerator,
  "chat-exchange-panel-attachments": ChatExchangeAttachmentsGenerator
}

export async function generateElement(elementName,llmName,params) {
  "use server"
  if (params.stream) {
    const generator = await LlmGenerator.create(generatorMap[elementName],llmName)
    return await generator.generate(params)
  } else {
    const generator = await LlmGenerator.create(generatorMap[elementName],llmName)
    const response = await generator.generate(params)
    if (params.save) {
      log("skipped save.")
      await generator.save(response,params)
    }
  }
}
