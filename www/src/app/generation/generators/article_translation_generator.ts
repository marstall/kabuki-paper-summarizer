import LlmGenerator from "../llm_generator";
import Llm from "@/app/models/llm";
import {prisma} from "@/app/lib/prisma";
import {extractFullTextFromArticle} from "@/app/models/article";
import {error, log} from "@/app/lib/logger";

const DEFAULT_PROMPT_NAME = "claims json with examples 1"
export default class ArticleTranslationGenerator extends LlmGenerator {
  async generate(params) {
    const options = {}
    options['max_tokens']||=params.maxTokens;
    const promptName = params.prompt || DEFAULT_PROMPT_NAME
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

    return await this.llm.chat(instructions, input,options)
  }

  async save(response, params) {
    const now = new Date();
    const promptName = params.prompt || DEFAULT_PROMPT_NAME
    const article = await prisma.articles.findUnique(({where: {id: params.articleId}}))
    const prompts = await prisma.prompts.findMany({where: {title: promptName}})
    if (!prompts || prompts.length == 0) {
      error("could not find prompt with title " + promptName)
      return;
    }
    const prompt = prompts[0]

    try {
      return await prisma.translations.create({
        data: {
          llm_id: this.llm.prismaLlm.id,
          body: response.answer,
          article_id: Number(params.articleId),
          claims: article.claims,
          prompt1: prompt.body,
          prompt_id: prompt.id,
          created_at: now,
          updated_at: now
        }
      })
    } catch (e) {
      error(e)
    }
  }
}
