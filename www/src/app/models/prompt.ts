import BaseModel from "@/app/models/base_model";
import {prisma} from '@/app/lib/prisma'

export default class Prompt extends BaseModel {
  static async get(title) {
    const prompts = await prisma.prompts.findMany({where:{title}})
    if (!prompts||prompts.length==0) {
      console.log("could not find prompt with title "+title)
      throw new Error("could not find prompt with title "+title)
    }
    return prompts[0].body;
  }

}
