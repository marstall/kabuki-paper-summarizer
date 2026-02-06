import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import {error, block, log, bold, divider, header} from '@/app/lib/logger'
import OpenAI from "openai";

export default class Llm extends BaseModel {
  static configuredLlm = null;
  static client = null

  static async openAiResponsesTypeHandler(instructions, input, options) {
    const response = await Llm.client.responses.create({
      model: Llm.configuredLlm.model,
      instructions,
      reasoning: {effort: "medium"},
      input
    });
    return [response?.output_text]
  }

  static async openAiChatCompletionsTypeHandler(instructions, input, options) {
    const n = options['n'] || 1
    const messages = [
      {role: "system", content: instructions},
      {role: "user", content: input}
    ]
    const completion =  await Llm.client.chat.completions.create({
      model: Llm.configuredLlm.model,
      n,
      messages,
    });
    // console.log({completion})
    // console.log({completion:JSON.stringify(completion,null,2)})
    //console.log(JSON.stringify(completion.choices,null,2))
    // console.log(completion.choices[0].message.content)
    return completion.choices.map(choice=>choice.message.content)
  }

  static chatHandlers = {
    "openai-responses": Llm.openAiResponsesTypeHandler,
    "openai-chat-completions": Llm.openAiChatCompletionsTypeHandler
  }

  static async chat(instructions, input, options = {}) {
    return Llm.chatHandlers[Llm.configuredLlm.type](instructions, input, options)
  }

  static async loadDefault(llm_id) {
    try {
      const llm = await prisma.llms.findUnique({where: {id: llm_id}})
      Llm.configuredLlm = llm;
      log("llm provider", llm.provider)
      log("llm type", llm.type, true)
      if (Llm.isOpenAICompatible()) {
        Llm.client = new OpenAI({
          apiKey: llm.api_key,
          baseURL: llm.url,
        })
      }
    } catch (e) {
      error(e)
    }
  }

  static isOpenAICompatible() {
    const compatibleProviders = ["OpenAI", "Kimi", "DeepSeek"];
    return compatibleProviders.includes(Llm.configuredLlm.provider);
  }
}


