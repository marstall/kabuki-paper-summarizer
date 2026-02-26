import Link from "next/link";
import { prisma } from '@/app/lib/prisma'
import Paragraphs from "@/app/articles/[article_id]/sections/[section_id]/paragraphs/paragraphs";
import ParagraphNew from "@/app/articles/[article_id]/sections/[section_id]/paragraphs/new/paragraph-new";
import {redirect} from "next/navigation";
import _ from 'lodash'

export default async function SectionView({article_id,section_id}: any) {
  const section = await prisma.sections.findUnique({
    where: {id:section_id},
    include: {paragraphs:true}
  })
  async function deleteSectionAction() {
    'use server'
    await prisma.sections.delete({
      where: {
        id: section_id
      },
    });
    redirect(`/articles/${section.article_id}/sections`)
  }
  if (!section) return <div>Section Not found</div>
  return <>
    <Link className={'button'} href={`/articles/${article_id}/sections`}>
      &lt; Back to sections
    </Link>
    <br/><br/>

    <h1 className="title">Section: {section.title}</h1>
    <div className={'block'}>
    <Paragraphs article_id={article_id} section_id={section_id}/>
    </div>
    {_.isEmpty(section.paragraphs) && <form action={deleteSectionAction}>
      <button className={'button is-danger'} type={'submit'}>
        Delete Section
      </button>
    </form>}
    <br/>
    <div style={{padding:12,backgroundColor:'#eee',borderRadius:6}}>
    <ParagraphNew article_id={article_id} section_id={section_id}/>
    </div>
    <hr/>
    <Link className="button" href={`/articles/${article_id}/sections/new`}>
      New Section
    </Link>

    {/*<Link*/}
    {/*  className="button"*/}
    {/*  href={`/articles/${article_id}/sections/${section_id}/paragraphs`}>*/}
    {/*</Link>*/}
  </>
}
