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

  paragraphsJoined() {
    return this.paragraphs().map(p=>p.body).join("\r\n\r\n")
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


  async process_paragraphs(processor,range_start=0,range_end=null) {
    const openai = this.openai
    const conversation = await openai.conversations.create();
    const paragraphs = this.paragraphs()
    if (paragraphs.length===0) throw new Error("No paragraphs were found in article "+this.prismaArticle.id)
    const end = range_end ?? paragraphs.length
    for (let i = range_start; i < end; i++) {
      const paragraph = paragraphs[i]
      log("paragraph "+(i+1))
      bold(paragraph.title)
      block(paragraph.body)
      const pre = new Date()
      const output = await processor(conversation, paragraph, i)
      const elapsed = (new Date()-pre)/1000.0
      block(`Completed in ${elapsed} seconds.`)
    }
  }

  async extract_ideas_iteratively(conversation,paragraph,i) {
    const model = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"][0]
    const jsonExample = {
      claims:[{
        claim: "the idea/proposition/claim that exists in the paper, put simply, matching the language used in the paper, without jargon.",
        discussion: "a 2-3 sentence paragraph going a little deeper, in a newsy, punch voice, targeted to a kabuki parent who is not an expert in bio.",
        tags: "a list of relevant tags for this claim (ex: KMTD, metabolism, symptoms, therapy)",
        group: "maintain a small, intelligent list of groups (ex: Background, Baseline, Intervention Idea, Evidence, Discussion, Results) and assign each idea to a group.",
        basedOnText: "a json array of the verbatim text passages this claim is based on [passage1, passage 2, ...]",
        citations: "any citations contained within the text passages this claim is based on"
      }]
    }
    const instructions0 = `can you break down the following passage of a scientific paper 
    into a list of its individual claims/ideas/propositions? return the list to me
    in the following json format: ${JSON.stringify(jsonExample)}. Return ONLY raw JSON. 
    Do NOT wrap the response in markdown. Do NOT include \`\`\` or any extra text. 
    The response must be directly parseable by JSON.parse().`

    const instructions1 = `now let's look at the next paragraph in the article. Can you 
    analyze and do the following:
    - update any of the existing items in the list, including all json properties.
    - if there is a new idea, add it to the list, creating entries for each of the specified json properties
    - return the new list to to me in the same json format`
    const instructions = i===0 ? instructions0 : instructions1;
    const response = await this.openai.responses.create({
      model,
      instructions,
      input: `${paragraph.title}\n\n${paragraph.body}`,
      conversation: conversation.id
    });
    console.log(response)
    console.log(response.output_text)

    const json = JSON.parse(response.output_text)
    console.log(JSON.stringify(json, null,2))
    return response.output_text
    //console.log(JSON.stringify(response.output_text,null,2))
  }

  async extract_ideas_all_at_once() {
    const model = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"][0]
    const jsonExample = {
      claims:[{
        claim: "the idea/proposition/claim that exists in the paper, put simply, matching the language used in the paper, without jargon.",
        discussion: "a 2-3 sentence paragraph going a little deeper, in a newsy, punchy voice, targeted to a kabuki parent who is not an expert in bio.",
        tags: "a list of relevant tags for this claim (ex: KMTD, metabolism, symptoms, therapy)",
        group: "maintain a small, intelligent list of groups (ex: Background, Baseline, Intervention Idea, Evidence, Discussion, Results) and assign each idea to a group.",
        basedOnText: "a json array of the verbatim text passages this claim is based on [passage1, passage 2, ...]",
        citations: "any citations contained within the text passages this claim is based on"
      }]
    }
    const instructions = `can you break down the following scientific paper 
    into a list of its individual claims/ideas/propositions? return the list to me
    in the following json format: ${JSON.stringify(jsonExample)}. Return ONLY raw JSON. 
    Do NOT wrap the response in markdown. Do NOT include \`\`\` or any extra text. 
    The response must be directly parseable by JSON.parse().`

    const input = this.paragraphsJoined()
    bold("input")
    block(input)
    const response = await this.openai.responses.create({
      model,
      instructions,
      input,
    });
    console.log(response)
    console.log(response.output_text)

    const json = JSON.parse(response.output_text)
    console.log(JSON.stringify(json, null,2))
    return response.output_text
    //console.log(JSON.stringify(response.output_text,null,2))
  }


  async translateBasedOnClaimsJson(json) {
    const pre = new Date()

    const openai = this.openai
    const model = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"][0]



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
