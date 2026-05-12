import TranslationView from "./translation-view"
import {prisma} from "@/app/lib/prisma";
import type {Metadata, ResolvingMetadata} from "next";
import generateTranslationMetadata from "./translation-metadata";

export const dynamic = 'force-dynamic'

function shorten(text, maxLen = 180) {
    const cleaned = (text || "").replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLen) return cleaned;
    return `${cleaned.slice(0, maxLen - 1).trim()}…`;
}

function absoluteUrl(pathOrUrl) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) return pathOrUrl;
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
    return `${siteUrl.replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    {params, searchParams}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    return generateTranslationMetadata(params);
}

export async function _generateMetadata(_params) {
    console.log("generateMetata page.tsx")
    const params = await _params;
    let translationId;
    try {
        translationId = BigInt(params.translation_id);
    } catch (e) {
        return {}
    }

    const translation = await prisma.translations.findUnique({
        where: {id: translationId},
        select: {
            id: true,
            article_id: true,
            title: true,
            second_title: true,
            body: true,
        }
    })

    if (!translation) return {}

    const attachment = await prisma.attachments.findFirst({
        where: {article_id: translation.article_id},
        select: {id: true},
        orderBy: {id: "asc"},
    })

    const title = translation.title || "The Kabuki Papers"
    const description = shorten(
        translation.second_title || translation.body || "AI-generated plain-English summary of a Kabuki syndrome research paper."
    )
    const urlPath = `/translations/${params.translation_id}`
    const imagePath = attachment ? `/file/${attachment.id}` : "/favicon.ico"

    const ret = {
        title,
        description,
        openGraph: {
            type: "article",
            url: absoluteUrl(urlPath),
            title,
            description,
            images: [absoluteUrl(imagePath)],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [absoluteUrl(imagePath)],
        },
    }
    return ret;
}

export default async function Page({params}: { params: Promise<any> }) {
    return <>
        <TranslationView {...await params}/>
    </>
}
