import 'dotenv/config'   // <-- must be first
import {prisma} from '@/app/lib/prisma'
import Log, {bold,block, error, log} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import Llm from '@/app/models/llm'
import {shortDateTime} from "@/utils/date";
import {generateElement} from "@/app/generation/generate_element";

const DEFAULT_LLM="deepseek"

async function main(elementName,llmName: string, params) {
  function doNothing() {
    bold("doing nothing.","info")
  }

  Log.init({log_levels:params.logLevels})
  if (params.doNothing) {
    doNothing()
  } else {
    if (params.listLlms) {
      await Llm.listLlms()
      return
    }
    const pre = Date.now()
    await generateElement(elementName,llmName,params)
    const elapsed = (new Date() as any - (pre as any)) / 1000.0
    log("elapsed",elapsed)
    block("done.")
  }
}

const argv = await yargs(hideBin(process.argv))
  .option('element', {
    alias: 'e',
    type: 'string',
    demandOption: true,
  })
  .option('save', {
    alias: 's',
    type: 'boolean',
    demandOption: false,
  })
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: false,
  })
  .option('attachment-id', {
    alias: 'a',
    type: 'number',
    demandOption: false,
  })
  .option('translation-id', {
    alias: 't',
    type: 'number',
    demandOption: false,
  })
  .option('llm', {
    alias: 'l',
    type: 'string',
    demandOption: false,
  })
  .option('note', {
    alias: 'n',
    type: 'string',
    demandOption: false,
  })
  .option('prompt', {
    alias: 'pt',
    type: 'string',
    demandOption: false,
  })
  .option('list-llms', {
    alias: 'm',
    type: 'boolean',
    demandOption: false,
  })
  .option('log-levels', {
    alias: 'v',
    type: 'string',
    demandOption: false,
  })
  .option('generation', {
    alias: 't',
    type: 'string',
    demandOption: false,
  })
  .option('max-tokens', {
    alias: 'mt',
    type: 'number',
    demandOption: false,
  })
  .option('do-nothing', {
    alias: 'x',
    type: 'boolean',
    demandOption: false,
  })
  .strict()
  .parse()

const elementName = argv['element']
const save = argv['save']||false
const articleId = argv['article-id']
const attachmentId = argv['attachment-id']
const translationId = argv['translation-id']
const llmName = argv['llm']||DEFAULT_LLM
const generationNote = argv['note']||shortDateTime(Date.now())
const listLlms = argv['list-llms']||false
const logLevels = argv['log-levels']
const generation = argv['generation']||(Math.floor(Date.now()/1000)+"")
const doNothing = argv['do-nothing']
const maxTokens = argv['max-tokens']
const prompt = argv['prompt']
const errors = []
if (!listLlms && !doNothing) {
  if (!llmName) errors.push("--llm required")
}
const params = {
  articleId,
  translationId,
  elementName,
  save,
  llmName,
  generationNote,
  listLlms,
  doNothing,
  logLevels,
  generation,
  prompt,
  attachmentId,
  maxTokens
}

if (errors.length > 0) {
  for (const e of errors) {
    error(e)
  }
} else main(elementName, llmName, params as any)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
