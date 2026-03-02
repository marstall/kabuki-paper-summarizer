import 'dotenv/config'   // <-- must be first
import {prisma} from '@/app/lib/prisma'
import Log, {log, divider, header, subheader, subheader2, bold} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {process_paragraph} from "@/app/lib/processors";
import Article from '@/app/models/article'
import openai from "openai";
import Prompt from "@/app/models/prompt";
import Llm from "@/app/models/llm";

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
  .strict()
  .parse()

const articleId = argv['article-id']
const llmId = argv['llm-id']
if (!Number.isInteger(articleId) || articleId <= 0) {
  throw new Error(`Invalid --article-id: ${String(articleId)}`)
}
if (!Number.isInteger(llmId) || llmId <= 0) {
  throw new Error(`Invalid --llm-id: ${String(articleId)}`)
}


async function main(llmId: number, articleId: number) {
  Log.init()
  await Llm.loadDefault(llmId)
  const article = await Article.create(articleId)
  bold("EXTRACT CLAIMS")
  bold(article.prismaArticle.original_title)
  const json = await article.extractClaims();
  await article.update("claims", json)
}

main(llmId,articleId)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
