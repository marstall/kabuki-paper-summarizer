import TranslationViewClient from "@/app/components/translation-view-client/translation-view-client";
import _ from "lodash";
import {prisma} from "./prisma";
import {cache} from "react";

export const loadTranslation = cache(async (translation_id) =>{
  return prisma.translations.findUnique({
      where: {id: translation_id},
      include: {
        llms: true,
        prompts: true,
        articles: {
          include: {
            attachments: {
              where: {active:true},
              orderBy: {created_at: 'desc'},
              select: {
                id: true,
                caption: true,
                size: true,
                width: true,
                height: true,
                alt_text: true
              }
            },
            sections: {
              orderBy: {
                id: 'asc'
              },
              include: {
                paragraphs: {
                  orderBy: {
                    id: 'asc'
                  }
                }
              },
            }
          }
        }
      }
    }
  )
})
