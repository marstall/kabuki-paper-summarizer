import LlmGenerator from "../llm_generator";
import Llm from "@/app/models/llm";
import {prisma} from "@/app/lib/prisma";
const headlinesPromptInstructions = `
    Given the following article, generate 2 headlines, a main headline (HED) and 
    a subheadline (DEK). These should be punchy and grabby, but fulsome to a degree in 
    what they reveal about the content. Informative. If there is a striking, counter-intuitive
    finding in the article, they should focus on that. 

    Important! The DEK should focus on or at least reference the paper's implications for Kabuki Syndrome.

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

export default class HeadlinesGenerator extends LlmGenerator {
  async generate(params) {
    const {translationId} = params
    if (!translationId) throw ("translationId required.")
    const translation = await prisma.translations.findUnique(({where:{id:translationId}}))
    return await this.llm.chat(headlinesPromptInstructions, translation.body)
  }

  async save(response,params) {
    const {translationId} = params
    if (!translationId) throw ("translationId required.")
    const json = JSON.parse(response.answer)
    const translation = await prisma.translations.findUnique({
      where:{id:translationId},
      include: {articles:true}
    })
    await prisma.articles.update(
      {
        where: {
          id: translation.articles.id
        },
        data: {
          title:json.hed,
          second_title:json.dek,
          category: json.category,
          updated_at: new Date()
        }
      })
  }
}
