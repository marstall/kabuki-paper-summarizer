import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import {error, block, log} from '@/app/lib/logger'
import OpenAI from "openai";

export default class Llm extends BaseModel {
  static configuredLlm = null;
  static client = null

  static async loadDefault(llm_id) {
    try {
      const llm = await prisma.llms.findUnique({where: {id: 1}})
      Llm.configuredLlm = llm;
      block(`using llm <${llm.provider}> ...`)
      if (isOpenAICompatible(llm)) {
        Llm.client = new OpenAI({
          apiKey: llm.api_key,
          baseURL: llm.url,
        })
      }
    } catch (e) {
      error(e)
    }
  }
}

function isOpenAICompatible(llm) {
  const compatibleProviders = ["OpenAI","Kimi","DeepSeek"];
  return compatibleProviders.includes(llm.provider);
}
