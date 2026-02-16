import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import Prompt from "@/app/models/prompt";
import {log, bold, block, header, error, divider} from "@/app/lib/logger"
import Llm from '@/app/models/llm'
import Translation from "@/app/models/translation";
import _ from 'underscore'

const sample_draft = `Kabuki syndrome stems from trouble with KMT2D, a gene that orchestrates development by tuning other genes on and off. Most research has relied on mice carrying severe disruptions that disable the protein entirely. But the genetics are more varied in the clinic than in the lab. (1)

Previous work suggested that neurological symptoms might be reversible after birth, at least in the classic mouse model. However, that model uses an artificial insertion that might create extra problems. It also fails to represent a significant minority of families whose children have different types of mutations. (2, 11)

To bridge this gap, researchers created a new animal model carrying a specific patient mutation. They used precise editing techniques to insert the change into standard lab mice. Rigorous checks confirmed the resulting traits tracked with this single alteration across five generations of breeding. (4, 16, 18, 35)

Roughly 15 to 30 percent of patients carry missense variants—single-letter changes that swap one amino acid for another—rather than truncating mutations. The team selected R5230H, a change within the FYRN domain where such variants cluster in patients. Unlike a prior missense model that required two mutated copies to show disease, this one reflects typical human inheritance. (3, 12, 15, 17, 27)

Surprisingly, lab tests showed the R5230H protein remains stable. Levels of KMT2D messenger RNA and protein looked normal, and global methylation marks on histones—the spools around which DNA winds—showed no decrease. The enzyme appears to keep its catalytic capacity, unlike some missense changes that do reduce activity, or the distinct disorder caused by variants in exons 38-39 that leaves cognition intact. (4, 5, 22, 31, 32)

Yet the mice developed classic Kabuki traits. They grew slowly, showed craniofacial differences, and suffered IgA deficiency, a type of immune problem characterized by low antibody levels. These physical and immunological signatures matched those seen in the older loss-of-function mice, suggesting such core features may arise through mechanisms other than reduced enzyme activity. (5, 21)

However, the neurological story diverged. Where the older model showed visuospatial defects and disrupted adult neurogenesis—the birth of new neurons in the hippocampus—these missense mice navigated normally and showed no shrinkage in brain regions tied to memory. Their hippocampal methylation looked typical, implying that some brain-specific symptoms might require actual loss of catalytic function. (6, 22, 29)

The model also revealed a striking new finding: high perinatal lethality and missing kidneys. About 43 percent of mice lacked one kidney from birth, a phenotype not reported in prior models though up to 40 percent of people with Kabuki syndrome have renal malformations. Intriguingly, kidney severity in patients does not correlate with variant type, and one previous patient with a truncating mutation showed the same unilateral agenesis. (7, 9, 24, 25, 26)

The survival drop happens around birth rather than during embryonic development, suggesting KMT2D plays an essential perinatal role possibly independent of its methyltransferase function. Surviving animals with single kidneys showed compensatory enlargement of their glomeruli, the tiny filtration units. (8, 10, 34)

Structural modeling offers a mechanistic clue. AlphaFold predictions suggest R5230H does not warp the protein's shape but reduces positive electrical charge in the FYRN domain. Drawing parallels to the chromatin-binding FYR domain in the related protein JMJ14, this region may normally anchor binding partners like NCOA6 or PAXI1-PGR1A, components of the COMPASS complex that helps regulate genes. The mutation appears to break these specific protein handshakes without destroying the enzyme's ability to methylate histones—a mechanism distinct from Wiedemann-Steiner syndrome, where related enzyme KMT2A shows different domain hotspots. (13, 19, 20, 28, 33)

This aligns with the patient source. The individual carrying this variant had mild intellectual disability with an IQ of 77 and no reported visuospatial problems—mirroring the mouse profile. The finding supports the idea that different KMT2D disruptions produce different cognitive footprints. (30)

For therapy development, the split is crucial. Previous treatments that boosted methylation rescued neurological deficits in loss-of-function mice, but they might miss the mark for patients whose variants preserve catalytic activity while disrupting protein interactions. The new model provides a platform to test interventions targeting binding rather than chemistry, serving the 15-30 percent of families whose genetics have until now lacked a representative animal system. (14, 23, 35)
`
export default class Article extends BaseModel {
  prismaArticle = null;

  constructor() {
    super()
  }

  async reload() {
    this.prismaArticle = await prisma.articles.findUnique({
      where: {id: this.prismaArticle.id}
    })
  }

  static async create(articleId) {
    const a = new Article()
    await a.load(articleId)
    return a
  }

  paragraphsJoined() {
    return this.paragraphs().map(p => p.body).join("\r\n\r\n")
  }

  paragraphs() {
    const paras = []
    this.prismaArticle.sections.forEach(section => {
      section.paragraphs.forEach(paragraph => {
        paras.push(paragraph)
      })
    })
    return paras;
  }

  async update(field, value, echo = false) {
    const results = await prisma.articles.update({
      where: {
        id: this.prismaArticle.id
      },
      data: {
        [field]: value
      }
    })
    if (echo) {
      bold("json results")
      block(results)
    }
    await this.reload();
  }

  async produceTranslation({forceExtractClaims, numDrafts, reviewDraft, editDraft, generateMetadata}) {
    if (!this.prismaArticle.claims || forceExtractClaims) {
      log("extracting claims ...")
      const json = await this.extractClaims();
      await this.update("claims", json)
    } else {
      log("skipping claim extraction ...")
    }

    let drafts = null;

    if (numDrafts > 0) {
      drafts = [sample_draft] //await this.writeDrafts("based on ideas json", numDrafts);
    } else {
      log("skipping all drafts ...")
    }
    for (let draft of drafts || []) {
      if (editDraft) {
        const draftReview = reviewDraft ? await this.reviewDraft("review pass", draft) : ""
        draft = await this.editDraft("editor pass 2", draft, draftReview);
      } else {
        log("skipping review + edit")
      }

      let json = {} as any;
      if (generateMetadata) {
        json = await this.generateMetadata(draft);
        if (!json.category || json.category.length === 0) {
          error("Generating metadata didn't work, stopping.")
          return;
        }
      }
      await Translation.create({
        llm_id: Llm.configuredLlm.id,
        title: json.title || this.prismaArticle.original_title,
        second_title: json.second_title,
        category: json.category,
        pull_quote: _.get(json.pull_quote, 0),
        pull_quote_index: _.get(json.pull_quote, 1),
        definitions: json.definitions,
        subheaders: json.subheaders,
        body: draft,
        article_id: Number(this.prismaArticle.id),
        claims: this.prismaArticle.claims
      })
    }
  }

  async generateMetadata(draft) {
    const pre = new Date()
    const category = `single word general category that this article falls into within Kabuki: examples could be
  'GENETICS', 'KMT2D', 'KMT6A', 'BRAIN','HEART','DIET','THERAPY', etc. This will appear above the title.`
    const title = `5 words or less. A 'hook' that pithily describes the meat of this article.`
    const second_title = `12 words or less. This will appear beneath the title and is an expansion on the title. 
    This is a magazine convention, it provides a little more detail the title may have left out because it was so short.`
    const tags = '5 or fewer one or two-word tags that describe the content of the article within Kabuki Syndrome'
    const pull_quote = `a single sentence direct quote from the article that highlights something interesting.
     Should be an an array that also includes the index of paragraph it should precede, like :['pull quote', 5]`
    const definitions = `a hash of short definitions that will appear inline next to a subset of paragraphs. 
      For example, if paragraph 5 introduces the term "Enhancers, there should be an entry like 
      {5:"Enhancers are regulatory DNA regions that amplify gene expression."}`
    const subheaders = `a short list of subheaders (no more than 4) to appear sprinkled throughout the text. They should be in sentence form
    and pull out a key fact from the next few paragraphs. In that sense, they are like a pull quote, but they should not be a direct quote.
    Format them like definitions, with the index of the paragraph they should appear before:  {"3":"subheader text"}. Should not have dependent
    clauses, multiple clauses, punctuation marks (except, judiciously, perhaps 1 comma) or parentheses.
    Examples: "Kabuki mice performed poorly on the Morris Water maze", "A cancer drug improved outcomes, but was consider too toxic",
    "Boosting CREB improved enhancer timing"`
    const jsonExample = {category, title, second_title, tags, pull_quote, definitions, subheaders}
    const instructions = `I need a number of strings to fill in spots in a typical magazine web layout. Can you read through the draft and generate
    them as specified in this json file? ${JSON.stringify(jsonExample)}.
    Important: Return ONLY raw JSON. Do NOT wrap the response in markdown.
    Do NOT include \`\`\` or any extra text. The response must be directly parseable by JSON.parse().`
    block("generating metadata ....")
    log('instructions', instructions,)
    console.log({llm: Llm.configuredLlm})
    // const response = await Llm.client.responses.create({
    //   model: Llm.configuredLlm.model,
    //   instructions,
    //   input: draft,
    // });
    const responses = await Llm.chat(instructions, draft)
    const response = responses[0];
    const elapsed = (new Date() as any - (pre as any)) / 1000.0
    block(`Completed in ${elapsed} seconds.`)
    log("response", response)
    const json = JSON.parse(response)
    bold("output")
    block(JSON.stringify(json, null, 2))
    return json
  }

  async extractClaims() {
    const pre = new Date()
    const jsonExample = {
      claims: [{
        reference_id: "the reference number of the claim. start with 0. the next claim is 1, the next is 2, etc.",
        claim: "the idea/proposition/claim that exists in the paper, put simply, matching the language used in the paper, without jargon.",
        discussion: "a 2-3 sentence paragraph going a little deeper, in a newsy, punchy voice, targeted to a kabuki parent who is not an expert in bio.",
        tags: "a list of relevant tags for this claim (ex: KMTD, metabolism, symptoms, therapy)",
        group: "maintain a small, intelligent list of groups (ex: Background, What Was Investigated, Results, What this means for Kabuki Syndrome) and assign each idea to a group.",
        basedOnText: "a json array of the verbatim text passages this claim is based on [exact text of passage1, exact text of passage 2, exact text of passage 3]",
        citations: "any citations contained within the text passages this claim is based on"
      }]
    }
    const instructions = `can you break down the following scientific paper into a list of its individual claims / ideas / propositions ?
    return the list to me in the following json format: ${JSON.stringify(jsonExample)}. 
    Important: Return ONLY raw JSON. Do NOT wrap the response in markdown.Do
    NOT include \`\`\` or any extra text. The response must be directly parseable by JSON.parse().`
    const input = this.paragraphsJoined()
    bold("input")
    block(input)
    const responses = await Llm.chat(instructions, input)
    const response = responses[0];
    // const response = await Llm.client.responses.create({
    //   model: Llm.configuredLlm.model,
    //   instructions,
    //   input,
    // });
    const elapsed = (new Date() as any - (pre as any)) / 1000.0
    block(`Completed in ${elapsed} seconds.`)

    const json = JSON.parse(response)
    bold("output")
    block(JSON.stringify(json, null, 2))
    return json
  }

  async writeDrafts(promptName, num = 1) {
    try {
      const pre = new Date()
      header(this.prismaArticle.original_title)
      const input = JSON.stringify(this.prismaArticle.claims);
      const instructions = await Prompt.get(promptName);
      bold(`writing first draft, using prompt <${promptName}> with  model < ${Llm.configuredLlm.model}> ...`)
      log("")
      block(instructions)
      const responses = await Llm.chat(instructions, input, {n: num})

      bold("draft")
      responses.map((response, i) => {
        header("option " + i)
        block(response)
        divider()
      })

      block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
      return responses
    } catch (e) {
      error(e)
    }
  }

  async reviewDraft(promptName, draft) {
    const pre = new Date()
    try {
      bold(`reviewing first draft with prompt <${promptName}> ...`)
      log(await Prompt.get(promptName))
      const response = await Llm.client.responses.create({
        model: Llm.configuredLlm.model,
        reasoning: {effort: "medium"},

        instructions: await Prompt.get(promptName),
        input: draft,
      });

      bold("review json")
      const json = JSON.parse(response.output_text)
      block(JSON.stringify(json, null, 2));
      block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
      return json
    } catch (e) {
      error(e)
    }
  }

  async editDraft(promptName, draft, draftReview) {
    const pre = new Date()
    try {
      bold("editor pass")
      const input = `Audit: ${draftReview === "string" ? draftReview : JSON.stringify(draftReview, null, 2)}
        
        Article: ${draft}`;

      const response = await Llm.client.responses.create({
        model: Llm.configuredLlm.model,
        instructions: await Prompt.get(promptName),
        reasoning: {effort: "medium"},
        input,
      });
      bold("editor draft")
      block(response.output_text);
      block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
    } catch (e) {
      error(e)
    }
  }


  async load(articleId) {
    this.prismaArticle = await prisma.articles.findUnique(
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
                }
              }
            }
          }
        }
      }
    )
  }
}

/*


  async streamlined() {
    const instructions = `You are the primary assistant on chatgpt.com.

You are an award-winning science writer employed by an imaginary publication entitled "Scientific American: Kabuki Syndrome Edition."

Your default behavior is to produce fluent, editorial-quality, human-readable writing with strong narrative flow and good rhythm.

Use internal analysis to organize material, but present only polished prose.

Clarity, readability, and flow take priority over literal sentence-by-sentence mapping, provided no scientific claims are added or omitted.

Avoid exposing internal reasoning or analysis.`


    const input = `You are also a parent of a child with Kabuki Syndrome, and you understand the needs of Kabuki parents who want to understand their child’s diagnosis and the possibilities for emerging therapies.

Like them, being a Kabuki parent has sparked a strong interest in genetics, cells, memory, and learning, but you are not an expert.

Your goal is to help Kabuki parents understand complex science clearly, without emotional reassurance, advocacy language, or sentimentality.

Write in a friendly but unsentimental magazine-style voice suitable for the “Briefs” section at the beginning of the magazine.

Keep the language accessible but scientifically accurate.

Prefer shorter sentences and shorter paragraphs where possible, but do not sacrifice clarity, flow, or rhythm.

When technical terms are required, provide short inline definitions the first time they appear, such as missense, histone, or mouse model.

Where possible, use common words instead of technical terms, for example using “symptoms” instead of phenotype.

After introducing a multi-word term’s acronym, use that acronym consistently from then on.

Do not define terms that do not appear in the article.

Do not abbreviate the term “Kabuki Syndrome.”

End every sentence with appropriate punctuation.

Always end questions with a question mark.

You are given a JSON file containing all claims extracted from a scientific paper, with one entry per claim.

Using ONLY the information in the JSON:
- Write a coherent, fluent article that incorporates all claims.
- Do not add facts that are not present in the JSON.
- Do not omit any claims.

Use editorial judgment to organize the material into a readable narrative.

If some claims would disrupt flow or readability if integrated into the main narrative, include them as bullet points in a final section titled “Other findings.”

Here is the claims JSON: `
    try {
      const pre = create-edit Date()

      header(this.prismaArticle.original_title)
      bold('instructions')
      block(instructions)

      bold(`input`)
      block(input)
      log("writing ...")

      const response = await this.openai.responses.create({
        model: "gpt-5.2",
        instructions,
        reasoning: {effort: "low"},
        input:input+" "+JSON.stringify(this.prismaArticle.claims,null,2)
      });

      bold("output")
      block(response.output_text);
      block(`Completed in ${(create-edit Date() - pre) / 1000.0} seconds.`)
      return response.output_text
    } catch (e) {
      error(e)
    }
  }


  async translate() {
    const pre = create-edit Date()

    const openai = this.openai
    const paragraphs = this.paragraphs()
    if (paragraphs.length === 0) throw create-edit Error("No paragraphs were found in article " + this.prismaArticle.id)

    const model = ["gpt-5.2", "gpt-5-nano", "gpt-5.2-pro"][0]

    const conversation = await openai.conversations.create();

    // first do the abstract, paragraph 1

    header(this.prismaArticle.original_title)
    bold("model: " + model)

    let instructions = await Prompt.get("general text") + " " + await Prompt.get("abstract")
    for (let i = 0; i < 10; i++) {
      //block(instructions,"instructions")
      const paragraph = paragraphs[i]
      log("paragraph " + (i + 1))
      bold(paragraph.title)
      block(paragraph.body)
      const response = await this.openai.responses.create({
        model,
        instructions,
        input: paragraphs[0].body + " " + paragraphs[1].body + " " + paragraphs[1].body,
        conversation: conversation.id
      });
      const elapsed = (create-edit Date() - pre) / 1000.0
      bold("translation")
      block(response.output_text);
      block(`
      Completed in $
      {
        elapsed
      }
      seconds.`)
      instructions = await Prompt.get("general text") + " " + await Prompt.get("paragraph")
    }
  }


  async process_paragraphs(processor, range_start = 0, range_end = null) {
    const openai = this.openai
    const conversation = await openai.conversations.create();
    const paragraphs = this.paragraphs()
    if (paragraphs.length === 0) throw create-edit Error("No paragraphs were found in article " + this.prismaArticle.id)
    const end = range_end ?? paragraphs.length
    for (let i = range_start; i < end; i++) {
      const paragraph = paragraphs[i]
      log("paragraph " + (i + 1))
      bold(paragraph.title)
      block(paragraph.body)
      const pre = create-edit Date()
      const output = await processor(conversation, paragraph, i)
      const elapsed = (create-edit Date() - pre) / 1000.0
      block(`
      Completed in $
      {
        elapsed
      }
      seconds.`)
    }
  }

  async extract_ideas_iteratively(conversation, paragraph, i) {
    const model = ["gpt-5.2", "gpt-5-nano", "gpt-5.2-pro"][0]
    const jsonExample = {
      claims: [{
        claim: "the idea/proposition/claim that exists in the paper, put simply, matching the language used in the paper, without jargon.",
        discussion: "a 2-3 sentence paragraph going a little deeper, in a newsy, punch voice, targeted to a kabuki parent who is not an expert in bio.",
        tags: "a list of relevant tags for this claim (ex: KMTD, metabolism, symptoms, therapy)",
        group: "maintain a small, intelligent list of groups (ex: Background, Baseline, Intervention Idea, Evidence, Discussion, Results) and assign each idea to a group.",
        basedOnText: "a json array of the verbatim text passages this claim is based on [passage1, passage 2, ...]",
        citations: "any citations contained within the text passages this claim is based on"
      }]
    }
    const instructions0 = `
      can
      you
      break down
      the
      following
      passage
      of
      a
      scientific
      paper
      into
      a
      list
      of
      its
      individual
      claims / ideas / propositions ?
      return the
      list
      to
      me
      in the
      following
      json
      format: $
      {
        JSON.stringify(jsonExample)
      }
    .
      Return
      ONLY
      raw
      JSON.Do
      NOT
      wrap
      the
      response in markdown.Do
      NOT
      include \`\`\` or any extra text.
    The response must be directly parseable by JSON.parse().`

      const instructions1 = `now let's look at the next paragraph in the article. Can you
    analyze and do the following:
    - update any of the existing items in the list, including all json properties.
    - if there is a create-edit idea, add it to the list, creating entries for each of the specified json properties
    - return the create-edit list to to me in the same json format`
      const instructions = i === 0 ? instructions0 : instructions1;
      const response = await this.openai.responses.create({
        model,
        instructions,
        input: `${paragraph.title}\n\n${paragraph.body}`,
        conversation: conversation.id
      });
      console.log(response)
      console.log(response.output_text)

      const json = JSON.parse(response.output_text)
      console.log(JSON.stringify(json, null, 2))
      return response.output_text
      //console.log(JSON.stringify(response.output_text,null,2))
    }

  */
