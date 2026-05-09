"use server"
import {prisma} from "@/app/lib/prisma";

export default async function getLlms() {
    return await prisma.llms.findMany({where: {active: true}})
}
