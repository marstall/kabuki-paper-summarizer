import {ImageResponse} from "next/og";
import {loadArticle} from "@/app/lib/load-article.ts";
import {readFile} from 'node:fs/promises'
import {join} from 'node:path'

export async function handleArticleShareImageGet(request, params) {
    try {

        const charter = await readFile(
            join(process.cwd(), 'public/fonts/charter_regular-webfont.woff')
        )
        const charterBold = await readFile(
            join(process.cwd(), 'public/fonts/charter_bold-webfont.woff')
        )
        console.log("article-share-image")
        const article = await loadArticle(params['article-id']);
        const imageResponse = new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: 630,
                        padding: '20px 20px 0 20px',
                        fontFamily: 'charter',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <div style={{
                        fontSize: '42px',
                        color: 'green',
                        fontFamily: "charterBold",
                        display: 'flex',
                        flexDirection: 'row',
                        flexShrink: 0,
                    }}>
                        <div>The Kabuki Papers</div>
                        <div style={{
                            color: 'gray',
                            marginLeft: '0.5rem'
                        }}>Newsletter
                        </div>
                    </div>
                    {/*<div style={{*/}
                    {/*  fontSize:'30px',*/}
                    {/*  color:'green',*/}

                    {/*}}>*/}

                    {/*  The science of Kabuki syndrome, illuminated by AI*/}
                    {/*</div>*/}
                    <div style={{
                        color: 'black',
                        fontSize: '98px',
                        fontFamily: "charterBold",
                        flexShrink: 0,
                    }}>
                        {article?.original_title}
                    </div>
                    <div style={{
                        fontSize: '36px',
                        color: '#555',
                        overflow: 'hidden',
                    }}>
                        {article.second_title}
                    </div>

                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'charter',
                        data: charter,
                    },
                    {
                        name: 'charterBold',
                        data: charterBold,
                    },
                ],
            }
        )

        const buffer = await imageResponse.arrayBuffer()
        return new Response(Buffer.from(buffer), {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': String(buffer.byteLength),
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            },
        })
    } catch (e) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
