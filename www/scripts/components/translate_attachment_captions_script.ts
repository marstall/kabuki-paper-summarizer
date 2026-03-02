import 'dotenv/config'   // <-- must be first
import {prisma} from '@/app/lib/prisma'
import Log, {log, divider, header, subheader, subheader2, bold, block} from '@/app/lib/logger'
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

const DEFAULT_PROMPT_NAME = "translate attachment caption"


async function main(llmId: number, articleId: number, promptName: string, generation: string, generationNote: string) {
  Log.init()
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  await article.translateAttachmentCaptions(generationNote,generation)
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
const promptName = argv['prompt-name']||DEFAULT_PROMPT_NAME
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
