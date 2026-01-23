import 'dotenv/config'   // <-- must be first
import {prisma} from '../src/app/lib/prisma'
import {header, subheader, subheader2} from '../src/app/lib/logging'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {process_paragraph} from "@/app/lib/processors";

const argv = await yargs(hideBin(process.argv))
  .option('article-id', {
    alias: 'a',
    type: 'number',
    demandOption: true,
  })
  .option('paragraph-num', {
    alias: 'p',
    type: 'number',
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


async function main(articleId) {
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
  let paragraphIndex=1
  article.sections.forEach(section => {
    if (paragraphIndex<=paragraphNum) subheader(section.title)
    section.paragraphs.forEach(paragraph => {
      if (paragraphIndex<=paragraphNum) {
        subheader2(paragraph.title,paragraph.id)
        console.log(paragraph.body)
        if (paragraph) {
          if (paragraphNum===paragraphIndex) {
            process_paragraph(paragraph)
          }
        } else {
          process_paragraph(paragraph)
        }
        paragraphIndex++
      }
    })

  })
  console.log("")
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
