import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import Log, {block, log} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import Article from '@/app/models/article'
import Llm from '@/app/models/llm'
import Translation from "@/app/models/translation";

async function main(articleId: number, llmId: number, params) {
  Log.init()
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  const result = await article.produceTranslation(params)
  if (params.translateAttachmentCaptions) {
    await article.translateAttachmentCaptions()
  }
  log("")
  block("done.")
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
  .option('generate-metadata', {
    alias: 'm',
    type: 'boolean',
    demandOption: false,
  })
  .option('translate-attachment-captions', {
    alias: 'c',
    type: 'boolean',
    demandOption: false,
  })

  .option('num-drafts', {
    alias: 'w',
    type: 'number',
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
  .option('note', {
    alias: 'n',
    type: 'string',
    demandOption: false,
  })
  .strict()
  .parse()
console.log("hi")

const articleId = argv['article-id']
const numDrafts = argv['num-drafts'] || 0
const forceExtractClaims = argv['force-extract-claims'] || false
const generateMetadata = argv['generate-metadata'] || true
const translateAttachmentCaptions = argv['translate-attachment-captions'] || true
const reviewDraft = argv['review-draft'] || false
const editDraft = argv['edit-draft'] || false
const llmId = argv['llm-id']
const generationNote = argv['note']
const params = {forceExtractClaims, numDrafts, reviewDraft, editDraft, generateMetadata, generationNote,translateAttachmentCaptions}
block(params);

main(articleId, llmId, params as any)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
