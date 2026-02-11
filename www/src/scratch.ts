import {prisma} from './app/lib/prisma'
import Prompt from "@/app/models/prompt";
import {log, bold, block, header, error, divider} from "@/app/lib/logger"
import Llm from '@/app/models/llm'
import Translation from "@/app/models/translation";
import _ from "underscore/modules/index-all";

// Translation.create({
//   llm_id: Llm.configuredLlm.id,
//   title: json.title || this.prismaArticle.original_title,
//   second_title: json.second_title,
//   category:json.category,
//   pull_quote: _.get(json.pull_quote,0),
//   pull_quote_index: _.get(json.pull_quote,1),
//   definitions: json.definitions,
//   subheaders: json.subheaders,
//   body: draft,
//   article_id: Number(this.prismaArticle.id),
//   claims: this.prismaArticle.claims
// })
const now = new Date();


await prisma.translations.create({
  data: {
    llm_id: 2,
    title: "title",
    second_title: "secon_title",
    category: "category",
    pull_quote: "pull quote",
    pull_quote_index: 0,
    definitions: {},
    subheaders: {},
    body: "body",
    article_id:1,
    claims:{},
    created_at: now,
    updated_at: now
  }
})
