import BaseModel from "@/app/models/base_model";
import {prisma} from "@/app/lib/prisma";
import {error} from '@/app/lib/logger'

export default class Translation extends BaseModel {

  static async translateAttachmentCaptions(translation) {
    const article = await prisma.articles.findUnique({where:{id:translation.article_id}})
  }

  static async create(data) {
    const now = new Date();

    try {
      return await prisma.translations.create({
        data: {
          ...data,
          created_at: now,
          updated_at: now
        }
      })
    } catch (e) {
      error(e)
    }
  }
}
