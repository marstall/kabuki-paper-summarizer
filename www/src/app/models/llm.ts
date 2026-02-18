import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'
import {error, block, log, bold, divider, header} from '@/app/lib/logger'
import OpenAI from "openai";
import {GoogleGenAI, ThinkingLevel} from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

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
    const completion = await Llm.client.chat.completions.create({
      model: Llm.configuredLlm.model,
      n,
      messages,
    });
    return completion.choices.map(choice => choice.message.content)
  }

  static async geminiGenerateContentTypeHandler(instructions, input, options) {
    const response = await Llm.client.models.generateContent({
      model: Llm.configuredLlm.model,
      contents: input,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        systemInstruction: instructions
      }
    });
    return [response.text]
  }

  static async claudeMessagesCreateTypeHandler(instructions, input, options) {
    const response = await Llm.client.messages.create(({
      model: Llm.configuredLlm.model,
      max_tokens: options.max_tokens || 5000,
      system: instructions,
      messages: [
        {role: "user", content: input}
      ]
    }))
    return [response.content[0].text];
  }

  static chatHandlers = {
    "openai-responses": Llm.openAiResponsesTypeHandler,
    "openai-chat-completions": Llm.openAiChatCompletionsTypeHandler,
    "gemini-generate-content": Llm.geminiGenerateContentTypeHandler,
    "claude-messages-create": Llm.claudeMessagesCreateTypeHandler
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
      } else if (Llm.configuredLlm.type === 'gemini-generate-content') {
        Llm.client = new GoogleGenAI({apiKey: llm.api_key});
      } else if (Llm.configuredLlm.type === 'claude-messages-create') {
        Llm.client = new Anthropic({apiKey: llm.api_key})
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


