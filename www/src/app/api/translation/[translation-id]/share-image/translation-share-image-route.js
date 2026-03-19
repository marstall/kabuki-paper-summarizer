import {ImageResponse} from "next/og";
import {loadTranslation} from "@/app/lib/load-translation.ts";
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function handleTranslationShareImageGet(request, params) {
  try {

    const charter = await readFile(
      join(process.cwd(), 'public/fonts/charter_regular-webfont.woff')
    )
    const charterBold = await readFile(
      join(process.cwd(), 'public/fonts/charter_bold-webfont.woff')
    )
    const translation = await loadTranslation(params['translation-id']);
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '20px',
            fontFamily:'charter',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{
            fontSize: '42px',
            color: 'green',
            fontFamily: "charterBold",
            display: 'flex',
            flexDirection: 'row'
          }}>
            <div>The Kabuki Papers</div>
            <div style={{color:'gray',marginLeft:'0.5rem'}}>Newsletter</div>
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

          }}>
            {translation?.articles.title}
          </div>
          <div style={{
            fontSize: '36px',
            color: '#555'
          }}>
            {translation?.articles.second_title}
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
        ], }
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
