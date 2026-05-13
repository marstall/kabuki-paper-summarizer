import BaseModel from "@/app/models/base_model";
import {prisma} from "@/app/lib/prisma";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {GoogleGenAI, ThinkingLevel} from "@google/genai";
import {log} from "@/app/lib/logger";
import type {llms} from "@prisma/client";

/*
  usage:
  const llm = await Llm.create("deepseek") // 'deepseek' from the 'name' column on the llms table
  const response = llm.chat("translate into french", "what is your name?")
  // response = "comment t'appelles-tu?"
 */
export interface ChatResponse {
    answer: string;

    [key: string]: any;
}

export default class Llm {
    static clients = {}
    prismaLlm: llms | null = null;

    constructor(prismaLlm: llms) {
        this.prismaLlm = prismaLlm;
    }

    static async create(name): Promise<Llm> {
        const prismaLlms = await prisma.llms.findMany({where: {name}})
        if (!prismaLlms || prismaLlms.length < 1) {
            throw (`can't find llm ${name}`);
        }
        const prismaLlm = prismaLlms[0]
        return new Llm(prismaLlm)
    }

    static async listLlms() {
        const llms = await prisma.llms.findMany({orderBy: {id: "asc"}});
        console.table(llms, ["id", "provider", "model", "type"])
    }

    client() {
        let client: any;
        // check first if we've alread loaded this client into static <clients> map
        if (this.isOpenAICompatible()) {
            client = Llm.clients[Number(this.prismaLlm.id)] || new OpenAI({
                apiKey: this.prismaLlm.api_key,
                baseURL: this.prismaLlm.url,
            })
        }
        else if (this.isAnthropicCompatible()) {
            client = Llm.clients[Number(this.prismaLlm.id)] || new Anthropic({
                apiKey: this.prismaLlm.api_key,
                baseURL: this.prismaLlm.url,
            })
        }
        else if (this.prismaLlm.type === 'gemini-generate-content') {
            client = Llm.clients[Number(this.prismaLlm.id)] || new GoogleGenAI({apiKey: this.prismaLlm.api_key});
        }
        Llm.clients[Number(this.prismaLlm.id)] = client;
        return client;
    }

    isAnthropicCompatible() {
        const compatibleProviders = ["Anthropic", "MiniMax"];
        return compatibleProviders.includes(this.prismaLlm.provider);
    }

    isOpenAICompatible() {
        const compatibleProviders = ["OpenAI", "Kimi", "DeepSeek", "Ollama"];
        return compatibleProviders.includes(this.prismaLlm.provider);
    }

    async openAiResponsesTypeHandler(instructions, input, options) {
        const response = await this.client().responses.create({
            model: this.prismaLlm.model,
            instructions,
            reasoning: {effort: "medium"},
            input
        });
        const answer = response?.output_text.replace(/```json|```/g, '').trim(); // deepseek wrapping json in ```json ... ```
        const {input_tokens, output_tokens, total_tokens} = response.usage
        return {
            answer,
            input_tokens, output_tokens, total_tokens
        }
    }

    async openAiChatCompletionsTypeHandler(instructions, input, options) {
        const n = options['n'] || 1
        const messages = [
            {role: "system", content: instructions},
            {role: "user", content: input}
        ]
        const completion = await this.client().chat.completions.create({
            model: this.prismaLlm.model,
            n,
            messages,
        });
        const {
            prompt_tokens,
            completion_tokens,
            total_tokens
        } = completion.usage
        let response = completion.choices && completion.choices.length > 0 ?
            completion.choices[0].message?.content : ""
        response = response?.replace(/```json|```/g, '').trim(); // deepseek ignoring prompting and wrapping json in ```json ... ```
        return {
            answer: response, prompt_tokens, completion_tokens, total_tokens
        }
    }

    async claudeMessagesCreateTypeHandler(instructions, input, options) {
        const response = await this.client().messages.create(({
            model: this.prismaLlm.model,
            max_tokens: options.max_tokens || 5000,
            stream: options.stream,
            system: instructions,
            messages: [
                {role: "user", content: input}
            ]
        }))
        if (options.stream) {
            return response;
        }
        else {
            let answerText;
            let answerThinking; // MiniMax returns context.thinking ...
            for (const content of response.content) {
                if (content.type == 'text') answerText = content.text
                if (content.type == 'thinking') answerThinking = content.thinking
            }
            const {
                input_tokens,
                cache_creation_input_tokens,
                cache_read_input_tokens,
                output_tokens
            } = response.usage
            answerText = answerText.replace(/```json|```/g, '').trim(); // deepseek wrapping json in ```json ... ```

            return {
                answer: answerText,
                input_tokens,
                cache_creation_input_tokens,
                cache_read_input_tokens,
                output_tokens,
                thinking: answerThinking
            };
        }
    }

    async geminiGenerateContentTypeHandler(instructions, input, options) {
        const response = await this.client().models.generateContent({
            model: this.prismaLlm.model,
            contents: input,
            config: {
                thinkingConfig: {
                    thinkingLevel: ThinkingLevel.LOW,
                },
                systemInstruction: instructions
            }
        });
        const {
            promptTokenCount,
            candidatesTokenCount,
            totalTokenCount,
            thoughtsTokenCount
        } = response.usageMetadata
        return {
            answer: response.text,
            promptTokenCount,
            candidatesTokenCount,
            totalTokenCount,
            thoughtsTokenCount
        }
    }

    async chat(instructions, input, options = {}): Promise<any> {
        const chatHandlers = {
            "openai-responses": this.openAiResponsesTypeHandler,
            "openai-chat-completions": this.openAiChatCompletionsTypeHandler,
            "gemini-generate-content": this.geminiGenerateContentTypeHandler,
            "claude-messages-create": this.claudeMessagesCreateTypeHandler
        }
        return chatHandlers[this.prismaLlm.type].bind(this)(instructions, input, options)
    }
}
