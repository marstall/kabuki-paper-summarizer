'use server'

import {block, bold} from "@/app/lib/logger";
import {prisma} from "@/app/lib/prisma";
import {isLocal} from "@/app/lib/misc";

export default async function save(model,id,field:string, value,echo=false ) {
  if (!isLocal()) return;
  const modelMap = {
    "article": prisma.articles
  }
  const results = await modelMap[model].update({
    where: {
      id
    },
    data: {
      [field]: value
    }
  })
  if (echo) {
    bold("json results")
    block(results)
  }
}
