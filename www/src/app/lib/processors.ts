import OpenAI from "openai";
import {subheader} from "@/app/lib/logging";

export async function process_paragraph(paragraph,prompt) {
  const client = new OpenAI();
  const input = prompt.body +  paragraph.title +" "+paragraph.body
  const models = ["gpt-5.2","gpt-5-nano","gpt-5.2-pro"]
  const model = models[2]
  subheader(`calling ${model} with the following input`,'openai')
  console.log(input)
  const response = await client.responses.create({
    model,
    input
  });

  subheader("response")
  console.log(response.output_text);

}
