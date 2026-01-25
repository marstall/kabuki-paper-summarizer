import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import Log, {divider, header, subheader, subheader2} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {process_paragraph} from "@/app/lib/processors";
import Article from '@/app/models/article'

const argv = await yargs(hideBin(process.argv))
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: true,
  })
  .option('paragraph-num', {
    alias: 'n',
    type: 'number',
    demandOption: true,
  })
  .option('prompt', {
    alias: 'p',
    type: 'string',
    demandOption: true,
  })
  .strict()
  .parse()

const articleId = argv['article-id']
if (!Number.isInteger(articleId) || articleId <= 0) {
  throw new Error(`Invalid --article-id: ${String(articleId)}`)
}

const paragraphNum = argv['paragraph-num']
if (!Number.isInteger(paragraphNum) || paragraphNum <= 0) {
  throw new Error(`Invalid --paragraph-num: ${String(paragraphNum)}`)
}

const promptName = argv['prompt']

async function main(articleId: number) {
  Log.init()
  const article = await Article.create(articleId)
  article.translate()

  //
  // header(article.original_title, "title")
  // const paragraphs = []
  // article.sections.forEach(section=>{
  //   section.paragraphs.forEach(paragraph=>{
  //     paragraphs.push(paragraph)
  //     })
  //   })
  // if (paragraphNum>paragraphs.length) {
  //   throw new Error(`Invalid --paragraph-num: ${String(paragraphNum)}`)
  // }
  // console.log({paragraphNum,paragraphsLength:paragraphs.length,promptName})
  // const prompts = await prisma.prompts.findMany({where:{title:promptName}})
  // if (!prompts||prompts.length===0) {
  //   throw new Error(`Invalid --prompt: ${String(prompt)}`)
  // }
  // const paragraph = paragraphs[paragraphNum-1]
  // subheader2(paragraph.title)
  // console.log(paragraph.body)
  // console.log("")
  // process_paragraph(paragraph,prompts[0])
  //
  // console.log("")
}

main(articleId)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
