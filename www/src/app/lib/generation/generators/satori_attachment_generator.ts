import LlmGenerator from "../llm_generator";
import Llm from "@/app/models/llm";
import {prisma} from "@/app/lib/prisma";
import {extractFullTextFromArticle} from "@/app/models/article";
import {error, log} from "@/app/lib/logger";

export default class SatoriAttachmentGenerator extends LlmGenerator {
  async generate(params) {
    const promptName = params.prompt
    const {articleId} = params
    if (!articleId) throw ("articleId required.")
    const article = await prisma.articles.findUnique(({where: {id: articleId}}))
    const input = JSON.stringify(article.claims);
    const prompts = await prisma.prompts.findMany({where: {title: promptName}})
    if (!prompts || prompts.length == 0) {
      error("could not find prompt with title " + promptName)
      return;
    }
    const prompt = prompts[0]
    const instructions = prompt.body

    return await this.llm.chat(instructions, input)
  }

  async save(response, params) {
    const now = new Date();
    try {
      return await prisma.attachments.create({
        data: {
          llm_id: this.llm.prismaLlm.id,
          type: 'component',
          component: 'chat-exchange',
          params: response.answer,
          article_id: Number(params.articleId),
          created_at: now,
          updated_at: now,
          active: false
        }
      })
    } catch (e) {
      error(e)
    }
  }
}
