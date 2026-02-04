import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import Log, {block, log} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import Article from '@/app/models/article'
import Llm from '@/app/models/llm'

async function main(articleId: number,llmId: number,params) {
  Log.init()
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  const result = await article.produceTranslation(params)
  log("")
}

const argv = await yargs(hideBin(process.argv))
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: true,
  })
  .option('llm-id', {
    alias: 'l',
    type: 'number',
    demandOption: true,
  })
  .option('force-extract-claims', {
    alias: 'f',
    type: 'boolean',
    demandOption: false,
  })
  .option('write-draft', {
    alias: 'w',
    type: 'boolean',
    demandOption: false,
  })
  .option('review-draft', {
    alias: 'r',
    type: 'boolean',
    demandOption: false,
  })
  .option('edit-draft', {
    alias: 'e',
    type: 'boolean',
    demandOption: false,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
const writeDraft = argv['write-draft']||false
const forceExtractClaims = argv['force-extract-claims']||false
const reviewDraft = argv['review-draft']||false
const editDraft = argv['edit-draft']||false
const llmId = argv['llm-id']
const params = {forceExtractClaims,writeDraft,reviewDraft,editDraft}
block(params);

main(articleId,llmId,params as any)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
