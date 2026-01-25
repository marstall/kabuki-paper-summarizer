import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import OpenAI from "openai";
import Prompt from "@/app/models/prompt";
import {divider,log,bold,block} from "@/app/lib/logger"

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

  async translate() {
    const pre = new Date()

    const openai = this.openai
    const paragraphs = this.paragraphs()
    if (paragraphs.length===0) throw new("No paragraphs were found in article "+this.prismaArticle.id)

    const model = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"][0]

    const conversation = await openai.conversations.create();

    // first do the abstract, paragraph 1
    const instructions = await Prompt.get("general text")+" "+await Prompt.get("abstract")
    bold(model)
    bold("instuctions")
    block(instructions)
    bold("paragraph 1")
    block(paragraphs[0].body)
    const response = await this.openai.responses.create({
      model,
      instructions,
      input: paragraphs[0].body,
      conversation: conversation.id
    });
    const elapsed = (new Date()-pre)/1000.0
    bold("translation")
    block(response.output_text);
    block(`Completed in ${elapsed} seconds.`)
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
