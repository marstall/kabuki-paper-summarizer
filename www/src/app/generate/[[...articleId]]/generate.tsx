import GenerateClient from "./generate-client";
import {generateElement} from "@/app/lib/generation/generate_element"


// async function generateElement_(elementName, llmName = "claude", params = {}) {
//   "use server"
//   const STREAMING = true;
//   const response = await generateElement(elementName, llmName,
//       {...params, stream: STREAMING, save: true, articleId: 34})
//   if (STREAMING) {
//     return response;
//   } else {
//     redirect(`/articles/${34}`)
//
//   }
// }

export default async function Generate({params, searchParams}) {
    const {articleId: articleIdArray} = await params;
    const {llm, generator} = await searchParams;
    const articleId = articleIdArray?.[0];
    return <section className="section">
        <div className="container">
            <h1 className="title">
                Generate
            </h1>
            <div className="block">
                {/*
          Here on this page we want to be able to generate any element.
          we should be able to select the model + article.
          we should call the streaming version of the api.
          we don't show the list of elements here.
          the UI should be perfect/responsive:
           - It should show "optimistic" UI
           - It should show elements being generated in real time
           - It should be cancelable
           - It should be responsive during generation
           The general pattern is that we will be calling server actions
           to do the necessary work - but the server actions should stream
           data back to the client as they receives packets from the LLMs.
           The front end should subscibe to the updates and show them in the UI.
           If there is partial json returned, it should figure out a way to
           complete the json.
           Let's start with the article and llm dropdowns.

        */}
                <GenerateClient articleId={articleId}
                                llm={llm}
                                generator={generator}
                                generateElement={generateElement}/>
            </div>
        </div>
    </section>
}

