import {prisma} from '@/app/lib/prisma'


  async function main() {
    let check;
    check = Date.now()
    console.log("loading all articles ...")
    const articles = await prisma.articles.findMany();
    console.log(Date.now()-check)
    console.log(articles.map(t=>t.original_title)  )

    console.log("loading all translations ...")
    check = Date.now();
    const translations = await prisma.translations.findMany({select:{id:true,title:true}});
    console.log(Date.now()-check)
    console.log(translations.map(t=>t.title)  )

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
