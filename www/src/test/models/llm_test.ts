import Llm from '@/app/models/llm'
import {prisma} from '@/app/lib/prisma'
import {bold} from '@/app/lib/logger'

const prismaLlms = await prisma.llms.findMany()
for (const prismaLlm of prismaLlms) {
  const llm = await Llm.create(prismaLlm.name)
  bold(prismaLlm.name)
  const response = await llm.chat("translate the string into french", "what is your name?")
  console.log(response)
}
