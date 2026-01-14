import Submit from '@/app/article/create/submit-button'
import postgres from 'postgres';
import "@/app/client_utils.js"

async function saveArticle(formData) {
  const query = postgres(process.env.POSTGRES_URL, {ssl: 'require'});
  const url = formData.get('url');
  const original_title = formData.get('original_title');
  const year = formData.get('year');
  const attribution = formData.get('attribution');
  const full_text = formData.get('full_text');
  try {
    const result = await query
      `insert into articles (
                      created_at,
                      updated_at,
                      url,
                      original_title,
                      year,
                      attribution,
                      full_text
      )
        values (now(),now(),
                ${url},
                ${original_title},
                ${year},
                ${attribution},
                ${full_text}
               )`;
    console.log("result: ", result)
  } catch (e) {
    console.log("error running query")
    console.log(e)
  }
}

export default async function Create({productId}) {
  async function submit(formData) {
    'use server'
    console.log({formData})
    await saveArticle(formData)

  }

  console.log("rendering ...")
  return (
    <>
      <section className="section">
        <form id='_form' action={submit}>
          <div className="field">
            <label className="label">URL</label>
            <div className="control">
              <input className="input" type="text"
                     name="url"
                     defaultValue="https://www.avant.fm"
                     placeholder="Text input"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text"
                     name="original_title"
                     defaultValue=""
                     placeholder="Text input"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Publication year</label>
            <div className="control">
              <input className="input" type="text"
                     name="year"
                     defaultValue=""
                     placeholder="Text input"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Attribution</label>
            <div className="control">
              <textarea
                className="textarea"
                name="attribution"
                defaultValue=""
                placeholder="Text input"
                rows="3"
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          </div>
          <div className="field">
            <label className="label">Body</label>
            <div className="control">
              <textarea
                className="textarea"
                name="full_text"
                rows="50" cols="33"
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          </div>

          <Submit/>
        </form>
      </section>
    </>
  );
}
