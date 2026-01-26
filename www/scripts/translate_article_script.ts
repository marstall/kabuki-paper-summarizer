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
  .strict()
  .parse()

const articleId = argv['article-id']
if (!Number.isInteger(articleId) || articleId <= 0) {
  throw new Error(`Invalid --article-id: ${String(articleId)}`)
}


const promptName = argv['prompt']

async function main(articleId: number) {
  Log.init()
  const article = await Article.create(articleId)
  //article.translate()
  const fn = async (article,paragraph,i)=>{
    console.log("article: "+article.prismaArticle.id)
    console.log("paragraph: "+paragraph.id)
    console.log({i})
  }
  article.process_paragraphs(fn)

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
