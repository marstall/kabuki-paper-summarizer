import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import OpenAI from "openai";
import Prompt from "@/app/models/prompt";
import {divider, log, bold, block, header} from "@/app/lib/logger"
import _ from 'lodash'
// No paragraphs were harmed in the creation of this version.
export default class Article extends BaseModel {
  prismaArticle=null;
  openai=null;

  constructor(silent) {
    super()
    this.openai = new OpenAI();
  }

  static async create(articleId,silent=true) {
    const a = new Article(silent)
    await a.load(articleId)
    return a
  }

  paragraphs() {
    const paras = []
    this.prismaArticle.sections.forEach(section=>{
      section.paragraphs.forEach(paragraph=>{
        paras.push(paragraph)
      })
    })
    return paras;
  }

  async extract_concepts() {

  }

  async process_paragraphs(processor,range_start=0,range_end=null) {
    const paragraphs = this.paragraphs()
    if (paragraphs.length===0) throw new Error("No paragraphs were found in article "+this.prismaArticle.id)
    const end = range_end ?? paragraphs.length
    for (let i = range_start; i < end; i++) {
      const paragraph = paragraphs[i]
      log("paragraph "+(i+1))
      bold(paragraph.title)
      block(paragraph.body)
      const pre = new Date()
      await processor(this,paragraph,i)
      const elapsed = (new Date()-pre)/1000.0
      block(`Completed in ${elapsed} seconds.`)
    }
  }

  async translate() {
    const pre = new Date()

    const openai = this.openai
    const paragraphs = this.paragraphs()
    if (paragraphs.length===0) throw new Error("No paragraphs were found in article "+this.prismaArticle.id)

    const model = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"][0]

    const conversation = await openai.conversations.create();

    // first do the abstract, paragraph 1

    header(this.prismaArticle.original_title)
    bold("model: "+model)

    let instructions = await Prompt.get("general text")+" "+await Prompt.get("abstract")
    for (let i=0;i<10;i++) {
      //block(instructions,"instructions")
      const paragraph = paragraphs[i]
      log("paragraph "+(i+1))
      bold(paragraph.title)
      block(paragraph.body)
      const response = await this.openai.responses.create({
        model,
        instructions,
        input: paragraphs[0].body+" "+paragraphs[1].body+" "+paragraphs[1].body,
        conversation: conversation.id
      });
      const elapsed = (new Date()-pre)/1000.0
      bold("translation")
      block(response.output_text);
      block(`Completed in ${elapsed} seconds.`)
      instructions = await Prompt.get("general text")+" "+await Prompt.get("paragraph")
    }
  }

  async load(articleId) {
    this.prismaArticle = await prisma.articles.findUnique(
      {
        where: {id: articleId},
        include: {
          sections: {
            orderBy: {
              id: 'asc'
            },
            include: {
              paragraphs: {
                orderBy: {
                  id: 'asc'
                },
                include: {
                  translations: {
                    orderBy: {
                      id: 'asc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    )
  }
}
