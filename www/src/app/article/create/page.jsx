import Submit from '@/app/article/create/submit-button'

export default async function Create({productId}) {
  async function submit(formData) {
    'use server'
    console.log({formData})
  }
  console.log("rendering ...")
  return (
    <section className="section">
      <form action={submit}>
        <div className="field">
          <label className="label">URL</label>
          <div className="control">
            <input className="input" type="text" name="url" placeholder="Text input"/>
          </div>
        </div>
        <Submit/>
      </form>
    </section>
  );
}
