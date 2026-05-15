import LlmGenerator from "../llm_generator";
import {prisma} from "@/app/lib/prisma";
import {extractFullTextFromArticle} from "@/app/models/article";
import {log} from "@/app/lib/logger";
import {loadArticle} from "@/app/lib/load-article";

const USE_PARAGRAPH_BASED_CLAIMS = false;

const jsonExample = {
    claims: [
        {
            reference_id: "the reference number of the claim. start with 0. the next claim is 1, the next is 2, etc.",
            claim: "the idea/proposition/claim that exists in the paper, put simply, matching the language used in the paper, without jargon.",
            // prompt: "the claim in question form",
            //discussion: "a 2-3 sentence paragraph going a little deeper, in a newsy, punchy voice, targeted to a kabuki parent who is not an expert in bio.",
            //tags: "a list of relevant tags for this claim (ex: KMTD, metabolism, symptoms, therapy)",
            //group: "maintain a small, intelligent list of groups (ex: Background, What Was Investigated, Results, What this means for Kabuki Syndrome) and assign each idea to a group.",
            basedOnText: "a json array of the verbatim text passages this claim is based on. For example: [exact text of passage1, exact text of passage 2, exact text of passage 3]",
            //citations: "any citations contained within the text passages this claim is based on"
        }
    ]
} //877 899 5802

const prompt = `can you break down the following scientific paper into a list of its individual claims / ideas / propositions ?
    return the list to me in the following json format: ${JSON.stringify(jsonExample)}.
    Claims should not depend on each other or reference each other. Each claim should stand on its own. 
    Important: Return ONLY raw JSON. Do NOT wrap the response in markdown.
    Do NOT include \`\`\`json at the beginning/end or any extra text. The response must be directly parseable by JSON.parse().`

export default class ClaimsGenerator extends LlmGenerator {

    async generate(params) {
        const {articleId} = params
        if (!articleId) throw ("articleId required.")
        const article = await loadArticle(articleId)
        const fullText = await extractFullTextFromArticle(article)
        let paragraphs = [];
        for (const section of article.sections) {
            paragraphs = [...paragraphs, ...section.paragraphs]
        }
        if (USE_PARAGRAPH_BASED_CLAIMS) {
            const responses = await Promise.all(
                paragraphs.map(
                    (paragraph) => {
                        return this.llm.chat(prompt, paragraph.body, {max_tokens: 20000})
                    }
                )
            );
            let i = 0
            const claims = responses.reduce((acc, response) => {
                const json = JSON.parse(response.answer);
                const claims = json.claims.map((claim, j) => ({
                    ...claim,
                    reference_id: i++
                }))
                return [...acc, ...claims]
            }, [])
            return {answer: JSON.stringify({claims})}
        }
        else {
            return await this.llm.chat(prompt, fullText, {
                stream: params.stream,
                max_tokens: 20000
            })
        }
    }

    async save(response, params) {
        const {articleId} = params
        if (!articleId) throw ("articleId required.")
        console.log("response", response)
        const json = JSON.parse(response.answer || response)
        log("claims", JSON.stringify(json, null, 2))
        await prisma.articles.findUnique({
            where: {id: articleId}
        })
        return await prisma.articles.update(
            {
                where: {
                    id: articleId
                },
                data: {
                    claims: json
                }
            })
    }
}
