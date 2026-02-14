import BaseModel from "@/app/models/base_model";
import {prisma} from "@/app/lib/prisma";

export default class Attachment extends BaseModel {
  prismaAttachment = null;

  constructor() {
    super()
  }

  url() {
    return "/"
  }

  static createWithObject(attachment):Attachment {
    const a = new Attachment()
    a.prismaAttachment = attachment
    return a
  }

  static async createWithId(id):Promise<Attachment> {
    const a = new Attachment()
    await a.load(id)
    return a
  }

  setPrismaAttachment(attachment) {
    this.prismaAttachment = attachment;
  }
  async load(id) {
    this.prismaAttachment = await prisma.attachments.findUnique(
      {where: {id}}
    )
  }
}
