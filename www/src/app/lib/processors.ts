import OpenAI from "openai";
import {subheader} from "@/app/lib/logger";
import Article from "@/app/models/article";



export async function process_paragraph(paragraph,prompt) {
  const client = new OpenAI();
  const exampleOutput = '{title: "title text here ...",body: "body text here ..."}'
  const input = prompt.body +  paragraph.title +" "+paragraph.body
  //const input = "Can you translate this into english? " +  paragraph.title +" "+paragraph.body
  const models = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"]
  const model = models[0]
  subheader(`calling ${model} with the following input`,'openai')
  console.log(input)
  const pre = new Date()
  const conversation = await client.conversations.create()
  console.log({conversation})
  return;

  const response = await client.responses.create({
    model,
    instructions: prompt.body,
    input: paragraph.body
  });

  subheader("response")
  console.log(response.output_text);
  const elapsed = (new Date()-pre)/1000.0
  console.log(`Response took ${elapsed} seconds.`)
}


// "can you translate this into english "+ abstract  =15s (gpt-5.2-pro)
// full abstract prompt + abstract = 26s, 37s, 47s, 45s  (gpt-5.2-pro)
// full abstract prompt + abstract, into chatgpt app: 13 seconds - just a few seconds to first word
