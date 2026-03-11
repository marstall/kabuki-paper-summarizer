import Llm, {ChatResponse} from "@/app/models/llm";

export default abstract class LlmGenerator {
  llm: Llm | null = null;

  static async create<T extends LlmGenerator>(
    ctor: new ()=>T,
    llmName:string
  ): Promise<T> {
    const generator = new ctor()
    generator.llm = await Llm.create(llmName)
    return generator;
  }

  abstract generate(params: {}): Promise<ChatResponse>;
  abstract save(answer:ChatResponse,params: {}): any;
}
