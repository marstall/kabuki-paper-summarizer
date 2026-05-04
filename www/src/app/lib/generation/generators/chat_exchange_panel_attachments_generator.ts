import LlmGenerator from "../llm_generator";
import Llm from "@/app/models/llm";
import {prisma} from "@/app/lib/prisma";
import {extractFullTextFromArticle} from "@/app/models/article";
import {error, log} from "@/app/lib/logger";

export default class ChatExchangeAttachmentsGenerator extends LlmGenerator {
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
    try {
      const promptName = params.prompt
      const prompts = await prisma.prompts.findMany({where: {title: promptName}})
      if (!prompts || prompts.length == 0) {
        error("could not find prompt with title " + promptName)
        return;
      }
      const prompt = prompts[0]
      const now = new Date();
      let order = 1;
      const {panels} = JSON.parse(response.answer)
      console.log(panels)
      for (const panel of panels) {
        await prisma.attachments.create({
          data: {
            llm_id: this.llm.prismaLlm.id,
            type: 'component',
            component: 'chat-exchange-panel',
            params: panel,
            article_id: Number(params.articleId),
            created_at: now,
            updated_at: now,
            order,
            active: false,
            prompt_id: prompt.id,
            prompt_text: prompt.body
          }
        })
        order++;
      }
    } catch (e) {
      error(e)
    }
  }
}
