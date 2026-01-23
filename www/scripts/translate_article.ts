import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import {header, subheader, subheader2} from '../src/app/lib/logging'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'

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

async function main(aricleId) {
  const article = await prisma.articles.findUnique(
    {
      where: {id: articleId},
      include: {
        sections: {
          orderBy: {
            id: 'asc'
          },
          include: {
            paragraphs: {
              orderBy: {
                id: 'asc'
              },
              include: {
                translations: {
                  orderBy: {
                    id: 'asc'
                  }
                }
              }
            }
          }
        }
      }
    }
  )
  header(article.original_title, "title")
  article.sections.forEach(section => {
    subheader(section.title)
    section.paragraphs.forEach(paragraph => {
      subheader2(paragraph.title)
      console.log(paragraph.body)
    })

  })
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
