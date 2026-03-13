import LlmGenerator from "../llm_generator";
import {prisma} from "@/app/lib/prisma";
import {error, log} from "@/app/lib/logger";
import {extractFullTextFromArticle} from "@/app/models/article";
import {ChatResponse} from "@/app/models/llm";

/*
    const instructions = await Prompt.get("translate attachment caption")
    const attachments = await prisma.attachments.findMany(
      {where: {article_id:Number(this.prismaArticle.id)}})
    for (const attachment of attachments) {
      const pre = new Date()
      const url = "https://kabuki-paper-summarizer-www.vercel.app/file/"+attachment.id;
      const caption = attachment.caption;
      if (!caption || caption.length<10) {
        log("skipping this attachment because it has no caption.")
        continue;
      }
      log("caption",caption)

      const input = `ARTICLE TEXT
      ${this.paragraphsJoined()}

      IMAGE URL
      ${url}

      ORIGINAL CAPTION
      ${caption}
      `
      log("instructions",instructions)
      log("input",input)
      const responses = await Llm.chat(instructions, input)
      const response = responses[0]
      const elapsed = (new Date() as any - (pre as any)) / 1000.0
      block(`Completed in ${elapsed} seconds.`)
      bold("output")
      block(response)
      const _translation = await Translation.create({
        llm_id: Llm.configuredLlm.id,
        body: response,
        attachment_id: Number(attachment.id),
        generation_note: generationNote,
        generation
      })
      log("saved as new translation w/id "+_translation.id)
    }
 */
const DEFAULT_PROMPT_NAME = "translate attachment caption"
export default class AttachmentCaptionGenerator extends LlmGenerator {
  async generate(params) {
    const promptName = params.prompt || DEFAULT_PROMPT_NAME
    const {attachmentId} = params
    if (!attachmentId) throw ("attachmentId required.")
    const attachment = await prisma.attachments.findUnique(({
      where: {id: attachmentId},
      include: {articles:true}
    }))
    if (!attachment.caption) return await new Promise<ChatResponse>(()=>({answer:""}));
    const url = "https://kabuki-paper-summarizer-www.vercel.app/file/"+attachment.id;
    const caption = attachment.caption;

    const input = `ARTICLE TEXT
      ${extractFullTextFromArticle(attachment.articles)}

      IMAGE URL
      ${url}

      ORIGINAL CAPTION
      ${caption}
      `
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
    const promptName = params.prompt || DEFAULT_PROMPT_NAME
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
          attachment_id: Number(params.attachmentId),
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
