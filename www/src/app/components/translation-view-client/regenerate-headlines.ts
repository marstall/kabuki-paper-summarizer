'use server'

import {generateElement} from "@/app/generation/generate_element"

export default async function regenerateHeadlines(translationId) {
  await generateElement("headlines","claude",{translationId,save:true})
}
