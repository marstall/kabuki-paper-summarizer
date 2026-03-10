import 'dotenv/config'   // <-- must be first
import {prisma} from '@/app/lib/prisma'
import Log, {log, divider, header, subheader, subheader2, bold, block} from '@/app/lib/logger'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {process_paragraph} from "@/app/lib/processors";
import Article from '@/app/models/article'
import openai from "openai";
import Prompt from "@/app/models/prompt";
import Llm from "@/app/models/llm";
import Translation from "@/app/models/translation";
import _ from "underscore/modules/index-all";
import {shortDateTime} from "@/utils/date";



async function main(llmId: number, translationId: number, promptName: string, generation: string, generationNote: string) {
  Log.init()
  await Llm.loadDefault(llmId)
  const pre = new Date()

  const translation = await prisma.translations.findUnique({where: {id: translationId}})
  const article = await prisma.articles.findUnique({where: {id:translation.article_id}})
  const input = JSON.stringify(translation.body);
  let instructions = `
    Given the following article, generate 2 headlines, a main headline (HED) and 
    a subheadline (DEK). These should be punchy and grabby, but fulsome to a degree in 
    what they reveal about the content. Informative. If there is a striking, counter-intuitive
    finding in the article, they should focus on that. 
    
    Also create a one or two word CATEGORY to appear above the HED
    Here are three good examples that can guide 
    you:
    
    EXAMPLE 1:
    CATEGORY: Diet
    HED: An Atkins-like diet improved memory in Kabuki mice
    DEK: Ketogenic regimen resulted in birth of new neurons, dramatically improved maze performance in 2017 study — promise was also shown for an injectable alternative
    
    EXAMPLE 2:
    CATEGORY: Genetics
    HED: Kabuki Syndrome: Small Genetic Change, Big Impact
    DEK: Researchers found that a tiny genetic change in KMT2D can replicate the core Kabuki Symptoms seen when the whole gene fails - with one key exception.
    
    EXAMPLE 3:
    CATEGORY: Epigentics
    HED: Why Kabuki (and other Epigenetic disorders) impact the brain
    DEK: A deep, comparative study that shines a light on the various "MDEM"s - Kabuki, Rubinstein-Taybi, Tatten-Brown et al. - and why they impact cognition
    
    your response should be in the following json format:
    {
      hed: '<hed>',
      dek: '<dek>,
      category: '<category>'
    }
    
    Do not "wrap" the json in anything, for example "\'\'\'json ... \'\'\'". I will be passing
    your response directly into JSON.parse.
    
    Internally generate 5 options and return the one with the shortest hed and dek.
    Don't be cute. Here's an example of "being cute", for reference: a HED of 
    "Kabuki Belongs to a 179-Member Family of Syndromes—and That's Good News"
  `

  bold("instructions")
  block(instructions)
  const responses = await Llm.chat(instructions, input)
  const response = responses[0]
  block(response)
  const json = JSON.parse(response)
  await prisma.articles.update(
    {
      where: {
        id: article.id
      },
      data: {
        title:json.hed,
        second_title:json.dek,
        category: json.category,
        updated_at: new Date()
      }
    })

  block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
}

const argv = await yargs(hideBin(process.argv))
  .option('llm-id', {
    alias: 'l',
    type: 'number',
    demandOption: true,
  })
  .option('translation-id', {
    alias: 't',
    type: 'number',
    demandOption: true,
  })
  .option('generation', {
    alias: 'g',
    type: 'string',
    demandOption: false,
  })
  .option('note', {
    alias: 'n',
    type: 'string',
    demandOption: false,
  })
  .strict()
  .parse()

const translationId = argv['translation-id']
const llmId = argv['llm-id']
const promptName = argv['prompt-name']
const generation = argv['generation']||(Math.floor(Date.now()/1000)+"")
const generationNote = argv['note']||shortDateTime(Date.now())

if (!Number.isInteger(translationId) || translationId <= 0) {
  throw new Error(`Invalid --translation-id: ${String(translationId)}`)
}
if (!Number.isInteger(llmId) || llmId <= 0) {
  throw new Error(`Invalid --llm-id: ${String(llmId)}`)
}


main(llmId,translationId,promptName,generation,generationNote)
  .then(async (translationId) => {
    process.stdout.write(`${translationId}\n`)
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
