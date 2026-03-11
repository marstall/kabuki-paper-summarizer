import {prisma} from '@/app/lib/prisma'
import {log} from "@/app/lib/logger";
import {extractFullTextFromArticle} from "@/app/models/article";
const ARTICLE_ID = 29
const TRANSLATION_ID = 237
const ATTACHMENT_ID = 16

function header(article,translation,attachment,section,paragraph) {
  log("article",article.original_title+" ("+article.id+")")
  log("translation",(translation.body||"").substring(0,80)+" ("+translation.id+")")
  log("attachment", (attachment.caption||"").substring(0,80)+" ... ("+translation.id+")")
  log("section", section.title+" ("+translation.id+")")
  if (paragraph.title) {
    log("paragraph", paragraph.title+" ("+paragraph.id+")")
  } else {
    log("paragraph", (paragraph.body||"").substring(0,80)+" ... ("+paragraph.id+")")
  }
  log("")
}

async function testFunction(article,translation,attachment,section,paragraph) {
  header(article,translation,attachment,section,paragraph);
  const fullText = await extractFullTextFromArticle(article)
  log("full text of article",fullText)
}

const article = await prisma.articles.findUnique({where: {id: ARTICLE_ID}})
const translation = await prisma.translations.findUnique({where: {id: TRANSLATION_ID}})
const attachment = await prisma.attachments.findUnique({where: {id: ATTACHMENT_ID}})
const sections = await prisma.sections.findMany({where: {article_id: ARTICLE_ID}})
const section = sections[0]
const paragraphs = await prisma.paragraphs.findMany({where: {section_id: section.id}})
const paragraph = paragraphs[0]
await testFunction(article,translation,attachment,section,paragraph)
await prisma.$disconnect()
