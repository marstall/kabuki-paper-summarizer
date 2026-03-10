'use server'

import {generateElement} from "@/app/lib/llm_generators/everything_generator";

export default async function regenerateHeadlines(translationId) {
  await generateElement("headlines","claude",{translationId})
}
