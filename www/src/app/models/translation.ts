import BaseModel from "@/app/models/base_model";
import {prisma} from "@/app/lib/prisma";
import {error} from '@/app/lib/logger'

export default class Translation extends BaseModel {
  static async create(data) {
    const now = new Date();
    const dataaaa = {
      ...data,
      created_at: now,
      updated_at: now
    }
    console.log("dataaa",dataaaa)
    try {
      return await prisma.translations.create({data:dataaaa})
    } catch (e) {
      error(e)
    }
  }
}
