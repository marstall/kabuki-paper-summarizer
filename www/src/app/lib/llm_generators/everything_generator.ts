import {generateHeadlines,saveHeadlines} from "./generate_headlines";
import {log} from "@/app/lib/logger";

const funcMap = {
  "headlines": {
    generate: generateHeadlines,
    save: saveHeadlines
  }
}

export async function generateElement(elementName,llmName,params,performSave=true) {
  const {generate,save} = funcMap[elementName]
  const response = await generate(llmName,params)
  log("response",response)
  if (performSave) {
    log("saving ...")
    await save(response.answer,llmName,params)
  } else {
    log("skipped save.")
  }
}
