import { prisma } from '@/app/lib/prisma'

async function main() {
  const allArticles = await prisma.articles.findMany()
  // console.log('All articles:',
  //   JSON.stringify(allArticles, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
