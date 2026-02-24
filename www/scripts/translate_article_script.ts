import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import Log, {block, error, log} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import Article from '@/app/models/article'
import Llm from '@/app/models/llm'

async function main(articleId: number, translationId: number, llmId: number, params) {
  Log.init()
  if (params.listLlms) {
    await Llm.listLlms()
    return
  }
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  const translation = await article.produceTranslation(params)
  if (params.translateAttachmentCaptions) {
    if (!translationId && !translation) {
      error("You must supply a translationId.")
    }
    await article.translateAttachmentCaptions(translationId || translation.id, params.generationNote)
  }
  log("")
  block("done.")
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
  .option('list-llms', {
    alias: 'm',
    type: 'boolean',
    demandOption: false,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
const translationId = argv['translation-id']
const numDrafts = argv['num-drafts'] || 0
const forceExtractClaims = argv['force-extract-claims'] || false
const generateMetadata = argv['generate-metadata'] || true
const translateAttachmentCaptions = argv['translate-attachment-captions'] || false
const reviewDraft = argv['review-draft'] || false
const editDraft = argv['edit-draft'] || false
const llmId = argv['llm-id']
const generationNote = argv['note']
const listLlms = argv['list-llms']
const errors = []
if (!listLlms) {
  if (!articleId) errors.push("--article-id required.")

  if (!llmId) errors.push("--llm-id required")
}
const params = {
  forceExtractClaims,
  numDrafts,
  reviewDraft,
  editDraft,
  generateMetadata,
  generationNote,
  translateAttachmentCaptions,
  listLlms
}
block(params,"parameters",);

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
