import 'dotenv/config'   // <-- must be first
import {prisma} from '@/app/lib/prisma'
import Log, {error,log, divider, header, subheader, subheader2, bold, block} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {process_paragraph} from "@/app/lib/processors";
import Article from '@/app/models/article'
import openai from "openai";
import Prompt from "@/app/models/prompt";
import Llm from "@/app/models/llm";
import Translation from "@/app/models/translation";
import _ from "underscore/modules/index-all";
import {shortDateTime} from "@/utils/date";

const DEFAULT_PROMPT_NAME = "based on ideas json"


async function main(llmId: number, articleId: number, promptName: string, generation: string, generationNote: string) {
  Log.init()
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  const pre = new Date()
  const input = JSON.stringify(article.prismaArticle.claims);
  const prompts = await prisma.prompts.findMany({where:{title:promptName}})
  if (!prompts||prompts.length==0) {
    error("could not find prompt with title "+promptName)
    return;
  }
  const prompt = prompts[0]
  // if (article.prismaArticle.title) {
  //   instructions =  `${instructions}
  //   The HED for this article is "${article.prismaArticle.title}"
  //   `
  //   if (article.prismaArticle.second_title) {
  //     instructions =  `${instructions}
  //   The DEK for this article is "${article.prismaArticle.second_title}"
  //   `
  //   }
  //   instructions = `${instructions}
  //     Your job is to write the article that goes well in tone with this HEAD and DEK, and meets all the other things I said above.
  //     Do not include the HED and DEK in your response.
  //   `
  // }
  log("prompt",prompt.title)
  log("")
  const instructions = prompt.body
  // bold("instructions")
  // block(instructions)
  const responses = await Llm.chat(instructions, input)

  const response = responses[0]
  const translation = await Translation.create({
    llm_id: Llm.configuredLlm.id,
    body: response,
    article_id: Number(articleId),
    claims: article.prismaArticle.claims,
    prompt1: prompt.body,
    prompt_id: prompt.id,
    generation_note: generationNote,
    generation,
  })

  //

  if (!translation?.id) {
    throw new Error("Translation.create did not return an id")
  }
  block(response)
  block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
  return translation.id
}

const argv = await yargs(hideBin(process.argv))
  .option('llm-id', {
    alias: 'l',
    type: 'number',
    demandOption: true,
  })
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: true,
  })
  .option('prompt-name', {
    alias: 'p',
    type: 'string',
    demandOption: false,
  })
  .option('generation', {
    alias: 'g',
    type: 'string',
    demandOption: false,
  })
  .option('note', {
    alias: 'n',
    type: 'string',
    demandOption: false,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
const llmId = argv['llm-id']
const promptName = argv['prompt-name']
const generation = argv['generation']||(Math.floor(Date.now()/1000)+"")
const generationNote = argv['note']||shortDateTime(Date.now())

if (!Number.isInteger(articleId) || articleId <= 0) {
  throw new Error(`Invalid --article-id: ${String(articleId)}`)
}
if (!Number.isInteger(llmId) || llmId <= 0) {
  throw new Error(`Invalid --llm-id: ${String(llmId)}`)
}


main(llmId,articleId,promptName,generation,generationNote)
  .then(async (translationId) => {
    process.stdout.write(`${translationId}\n`)
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
