import {log} from "@/app/lib/logger";
import LlmGenerator from "./llm_generator";
import HeadlinesGenerator from "./headlines_generator";
import ClaimsGenerator from "./claims_generator";

const generatorMap = {
  "headlines": HeadlinesGenerator,
  "claims": ClaimsGenerator
}

export async function generateElement(elementName,llmName,params) {
  const generator = await LlmGenerator.create(generatorMap[elementName],llmName)
  const response = await generator.generate(params)
  log("response",response)
  if (params.save) {
    log("skipped save.")
    await generator.save(response,params)
  }
}
