import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import Prompt from "@/app/models/prompt";
import {log, bold, block, header, error} from "@/app/lib/logger"
import Llm from '@/app/models/llm'
import Translation from "@/app/models/translation";

export default class Article extends BaseModel {
  prismaArticle = null;

  constructor(silent) {
    super()
  }

  static async create(articleId, silent = true) {
    const a = new Article(silent)
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
  }

  async produceTranslation({forceExtractClaims, writeDraft, reviewDraft, editDraft}) {
    if (!this.prismaArticle.claims || forceExtractClaims) {
      log("extracting claims ...")
      const json = await this.extractClaims();
      await this.update("claims", json)
    } else {
      log("skipping claim extraction ...")
    }

    let draft = null;

    if (writeDraft) {
      draft = await this.writeDraft("based on ideas json");
      // if (editDraft) {
      //     const draftReview = reviewDraft ? await this.reviewDraft("review pass",draft) : ""
      //     draft = await this.editDraft("editor pass 2",draft, draftReview);
      // } else {
      //   log("skipping review + edit")
      // }
    } else {
      log("skipping all drafts ...")
    }
    log({draft})
    Translation.create({
      llm_id: Llm.configuredLlm.id,
      title: this.prismaArticle.original_title,
      body: draft,
      article_id: Number(this.prismaArticle.id),
      claims: this.prismaArticle.claims
    })
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
    const instructions = `can you break down the following scientific paper
    into a list of its individual claims/ideas/propositions? return the list to me
    in the following json format: ${JSON.stringify(jsonExample)}. Return ONLY raw JSON.
    Do NOT wrap the response in markdown. Do NOT include \`\`\` or any extra text.
    The response must be directly parseable by JSON.parse().`

    const input = this.paragraphsJoined()
    bold("input")
    const response = await Llm.client.responses.create({
      model:Llm.configuredLlm.model,
      instructions,
      input,
    });
    const elapsed = (new Date() as any - (pre as any)) / 1000.0
    block(`Completed in ${elapsed} seconds.`)

    const json = JSON.parse(response.output_text)
    bold("output")
    block(JSON.stringify(json, null, 2))
    return json
  }


  async writeDraft(promptName) {
    try {
      const pre = new Date()
      header(this.prismaArticle.original_title)
      const input = JSON.stringify(this.prismaArticle.claims);
      const instructions = await Prompt.get(promptName);
      // log(`input is ${input.length} characters long.`)
      // log(`instructions are ${instructions.length} characters long.`)
      bold(`writing first draft, using prompt <${promptName}> with  model < ${Llm.configuredLlm.model}> ...`)
      log("")
      block(instructions)
      const response = await Llm.client.chat.completions.create({
        model: Llm.configuredLlm.model,
        messages:[],
        instructions,
        reasoning: {effort: "low"},
        input
      });

      bold("draft")
      block(response.output_text);
      block(`Completed in ${(new Date() as any - (pre as any)) / 1000.0} seconds.`)
      return response.output_text
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
      const input = `Audit:
        ${draftReview === "string" ? draftReview : JSON.stringify(draftReview, null, 2)}
        
        Article:
        ${draft}`;

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
      const pre = new Date()

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
      block(`Completed in ${(new Date() - pre) / 1000.0} seconds.`)
      return response.output_text
    } catch (e) {
      error(e)
    }
  }


  async translate() {
    const pre = new Date()

    const openai = this.openai
    const paragraphs = this.paragraphs()
    if (paragraphs.length === 0) throw new Error("No paragraphs were found in article " + this.prismaArticle.id)

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
      const elapsed = (new Date() - pre) / 1000.0
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
    if (paragraphs.length === 0) throw new Error("No paragraphs were found in article " + this.prismaArticle.id)
    const end = range_end ?? paragraphs.length
    for (let i = range_start; i < end; i++) {
      const paragraph = paragraphs[i]
      log("paragraph " + (i + 1))
      bold(paragraph.title)
      block(paragraph.body)
      const pre = new Date()
      const output = await processor(conversation, paragraph, i)
      const elapsed = (new Date() - pre) / 1000.0
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
    - if there is a new idea, add it to the list, creating entries for each of the specified json properties
    - return the new list to to me in the same json format`
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
