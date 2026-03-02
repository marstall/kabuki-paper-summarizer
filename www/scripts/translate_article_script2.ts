import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import Log, {bold,block, error, log} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import Article from '@/app/models/article'
import Llm from '@/app/models/llm'
import {shortDateTime} from "@/utils/date";


async function main(articleId: number, translationId: number, llmId: number, params) {
  function doNothing() {
    bold("doing nothing.","info")
  }

  Log.init({log_levels:params.logLevels})
  if (params.doNothing) {
    doNothing()
  } else {
    await Llm.loadDefault(llmId)
    const article = await Article.create(articleId)
    const pre = Date.now()
    log(`[${Llm.configuredLlm.model} (${Llm.configuredLlm.id})] begin translating article id ${articleId} ...`,null,false,"minimal")
    const translation = await article.produceTranslation(params)
    if (params.translateAttachmentCaptions) {
      if (!translationId && !translation) {
        error("You must supply a translationId.")
      }
      await article.translateAttachmentCaptions(params.generationNote,params.generation)
    }
    const elapsed = (new Date() as any - (pre as any)) / 1000.0
    log(`[${Llm.configuredLlm.model} (${Llm.configuredLlm.id})] completed article id ${articleId} in ${elapsed} seconds.`,null,false,"minimal")
    log("")
    block("done.")
  }
}

const argv = await yargs(hideBin(process.argv))
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: false,
  })
  .option('translation-id', {
    alias: 't',
    type: 'number',
    demandOption: false,
  })
  .option('llm-id', {
    alias: 'l',
    type: 'number',
    demandOption: false,
  })
  .option('generate-metadata', {
    alias: 'gm',
    type: 'boolean',
    demandOption: false,
  })
  .option('translate-attachment-captions', {
    alias: 'c',
    type: 'boolean',
    demandOption: false,
  })
  .option('num', {
    alias: 'n',
    type: 'number',
    demandOption: true,
  })
  .option('write-draft', {
    alias: 'w',
    type: 'number',
    demandOption: false,
  })
  .option('note', {
    alias: 'nt',
    type: 'string',
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
  .option('do-nothing', {
    alias: 'x',
    type: 'boolean',
    demandOption: false,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
const translationId = argv['translation-id']
const writeDrafts = argv['write-drafts'] || 0
const generateMetadata = argv['generate-metadata'] || false
const translateAttachmentCaptions = argv['translate-attachment-captions'] || false
const llmId = argv['llm-id']
const runDescription = argv['run-description']
const logLevels = argv['log-levels']
const doNothing = argv['do-nothing']
const errors = []
if (!doNothing) {
  if (!articleId) errors.push("--article-id required.")
  if (!llmId) errors.push("--llm-id required")
}
const params = {
  generateMetadata,
  runDescription,
  translateAttachmentCaptions,
  doNothing,
  logLevels,
}
//block(params,"parameters");

if (errors.length > 0) {
  for (const e of errors) {
    error(e)
  }
} else main(articleId, translationId, llmId, params as any)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
